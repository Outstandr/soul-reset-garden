import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Phone, PhoneOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LionelVoiceModeProps {
  onTranscript?: (text: string, isUser: boolean) => void;
}

export const LionelVoiceMode = ({ onTranscript }: LionelVoiceModeProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Lionel X voice agent");
      setIsConnecting(false);
      toast({
        title: "Connected",
        description: "You're now talking with Lionel X",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from voice agent");
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log("Voice message:", message);
      
      // Cast to any to access event types - ElevenLabs SDK types are not fully exposed
      const msg = message as any;
      
      if (msg.type === "user_transcript") {
        const userText = msg.user_transcription_event?.user_transcript;
        if (userText) {
          setTranscript(prev => [...prev, { role: "user", text: userText }]);
          onTranscript?.(userText, true);
        }
      } else if (msg.type === "agent_response") {
        const agentText = msg.agent_response_event?.agent_response;
        if (agentText) {
          setTranscript(prev => [...prev, { role: "assistant", text: agentText }]);
          onTranscript?.(agentText, false);
        }
      }
    },
    onError: (error) => {
      console.error("Voice conversation error:", error);
      toast({
        title: "Connection Error",
        description: typeof error === 'string' ? error : "Failed to connect to voice agent. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setTranscript([]);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please sign in to use voice mode");
      }

      // Get conversation token and overrides from edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get conversation token');
      }

      const { token, overrides } = await response.json();

      if (!token) {
        throw new Error("No conversation token received");
      }

      console.log("Starting voice session with WebRTC token and overrides:", overrides);

      // Start the conversation with WebRTC using conversation token
      // Note: overrides must be passed here, not in the hook initialization
      await conversation.startSession({
        conversationToken: token,
        overrides: overrides,
        connectionType: "webrtc",
      });

    } catch (error) {
      console.error("Failed to start voice conversation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start voice mode",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const toggleMute = useCallback(async () => {
    if (isMuted) {
      await conversation.setVolume({ volume: 1 });
    } else {
      await conversation.setVolume({ volume: 0 });
    }
    setIsMuted(!isMuted);
  }, [conversation, isMuted]);

  const isConnected = conversation.status === "connected";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
      {/* Voice Activity Indicator */}
      <div className="relative">
        <div 
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
            isConnected 
              ? conversation.isSpeaking 
                ? "bg-primary/20 animate-pulse ring-4 ring-primary/40"
                : "bg-muted ring-2 ring-primary/20"
              : "bg-muted"
          )}
        >
          {isConnecting ? (
            <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
          ) : isConnected ? (
            conversation.isSpeaking ? (
              <Volume2 className="w-12 h-12 text-primary animate-pulse" />
            ) : (
              <Mic className="w-12 h-12 text-primary" />
            )
          ) : (
            <MicOff className="w-12 h-12 text-muted-foreground" />
          )}
        </div>
        
        {/* Speaking indicator rings */}
        {isConnected && conversation.isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            <div className="absolute inset-[-8px] rounded-full border border-primary/20 animate-pulse" />
          </>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-lg font-medium">
          {isConnecting 
            ? "Connecting..." 
            : isConnected 
              ? conversation.isSpeaking 
                ? "Lionel is speaking..."
                : "Listening..."
              : "Voice mode ready"
          }
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isConnected 
            ? "Speak naturally - Lionel will respond"
            : "Click the button below to start talking"
          }
        </p>
      </div>

      {/* Live Transcript */}
      {transcript.length > 0 && (
        <div className="w-full max-h-48 overflow-y-auto bg-muted/50 rounded-lg p-4 space-y-2">
          {transcript.slice(-6).map((item, index) => (
            <div 
              key={index}
              className={cn(
                "text-sm",
                item.role === "user" ? "text-primary" : "text-foreground"
              )}
            >
              <span className="font-medium">
                {item.role === "user" ? "You: " : "Lionel: "}
              </span>
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {isConnected ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="rounded-full w-12 h-12"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={stopConversation}
              className="rounded-full px-6"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Call
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            onClick={startConversation}
            disabled={isConnecting}
            className="rounded-full px-8"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Phone className="w-5 h-5 mr-2" />
            )}
            {isConnecting ? "Connecting..." : "Start Voice Call"}
          </Button>
        )}
      </div>

      {/* Microphone Permission Note */}
      {!isConnected && (
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          Microphone access is required for voice conversations. 
          Your audio is processed securely.
        </p>
      )}
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, CheckCircle2 } from "lucide-react";

const UploadMasterclass = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, MOV, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (500MB limit)
    if (file.size > 524288000) {
      toast({
        title: "File too large",
        description: "Video must be under 500MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setFileName(file.name);

    try {
      // Simulate upload progress (since Supabase doesn't provide native progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { data, error } = await supabase.storage
        .from("masterclass-videos")
        .upload(`mental-mastery/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      setUploadComplete(true);
      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded successfully.`,
      });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("masterclass-videos")
        .getPublicUrl(`mental-mastery/${file.name}`);

      console.log("Video URL:", urlData.publicUrl);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl">Upload Masterclass Video</CardTitle>
            <CardDescription>
              Upload the Mental Mastery masterclass video (full length). The system will
              automatically segment it for the 12 interactive lessons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadComplete ? (
              <>
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center hover:border-primary/40 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer block"
                  >
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? "Uploading..." : "Choose Video File"}
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports MP4, WebM, MOV (Max 500MB)
                  </p>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fileName}</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
                <p className="text-muted-foreground mb-6">
                  {fileName} is ready for the interactive course module.
                </p>
                <Button onClick={() => navigate("/dashboard")} variant="hero">
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-card rounded-lg border">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Video will be stored securely in your backend</li>
            <li>✓ 12 lessons will reference specific timestamps</li>
            <li>✓ Each lesson plays only its designated segment</li>
            <li>✓ Interactive elements trigger after each segment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadMasterclass;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Send, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestWebhook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    country: "United States",
    phone: "+1 555 123 4567",
    userId: "test-user-" + Date.now(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLastResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ghl-webhook', {
        body: formData,
      });

      if (error) throw error;

      setLastResult({ success: true, message: 'Webhook sent successfully!' });
      toast.success('Test webhook sent to GHL!');
      console.log('Webhook response:', data);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send webhook';
      setLastResult({ success: false, message: errorMessage });
      toast.error(errorMessage);
      console.error('Webhook error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test GHL Webhook
            </CardTitle>
            <CardDescription>
              Send a test payload to your GoHighLevel webhook without creating a real user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="test@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">User ID</label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="test-user-123"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Webhook
                  </>
                )}
              </Button>
            </form>

            {lastResult && (
              <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                lastResult.success 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {lastResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={lastResult.success ? 'text-green-500' : 'text-red-500'}>
                  {lastResult.message}
                </span>
              </div>
            )}

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Payload Preview</h4>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify({
                  ...formData,
                  fullName: `${formData.firstName} ${formData.lastName}`,
                  source: 'LPA Platform',
                  signupDate: new Date().toISOString(),
                  tags: ['new_signup', 'lpa_platform'],
                }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestWebhook;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Send, CheckCircle, XCircle, Globe, Phone, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
  "Netherlands", "Belgium", "Spain", "Italy", "Portugal", "Ireland", "Sweden", 
  "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Poland", "Russia",
  "Brazil", "Mexico", "Argentina", "Japan", "South Korea", "China", "India",
  "South Africa", "Nigeria", "Egypt", "UAE", "Saudi Arabia", "Other"
];

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

  const getPayloadPreview = () => ({
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    fullName: `${formData.firstName} ${formData.lastName}`.trim(),
    phone: formData.phone,
    country: formData.country,
    source: 'LPA Platform',
    signupDate: new Date().toISOString(),
    userId: formData.userId,
    tags: ['new_signup', 'lpa_platform'],
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
              Send a test payload to your GoHighLevel webhook. This mirrors the exact data sent during user signup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="pl-10"
                    />
                  </div>
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="test@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger className="w-full">
                    <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555 123 4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">User ID (auto-generated)</label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="test-user-123"
                  className="font-mono text-sm"
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
              <h4 className="font-medium mb-2">Payload Preview (Exact GHL Format)</h4>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(getPayloadPreview(), null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestWebhook;

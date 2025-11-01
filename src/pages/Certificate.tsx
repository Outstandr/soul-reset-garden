import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CertificateView } from "@/components/certificate/CertificateView";

export default function Certificate() {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificate();
  }, [certificateNumber]);

  const loadCertificate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: certData, error: certError } = await supabase
        .from('user_certificates')
        .select('*')
        .eq('certificate_number', certificateNumber)
        .eq('user_id', user.id)
        .single();

      if (certError) throw certError;
      setCertificate(certData);
      setUserName(user.email?.split('@')[0] || "Student");
    } catch (error) {
      console.error('Error loading certificate:', error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!certificate) {
    return <div className="min-h-screen flex items-center justify-center">Certificate not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="zen-container py-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="zen-container py-12 max-w-4xl">
          <CertificateView
            userName={userName}
            courseName={certificate.course_name}
            moduleName={certificate.module_name}
            certificateNumber={certificate.certificate_number}
            issueDate={certificate.issue_date}
            finalScore={certificate.final_score}
          />
        </main>
      </div>
    </div>
  );
}

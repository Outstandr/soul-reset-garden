import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

interface CertificateViewProps {
  userName: string;
  courseName: string;
  moduleName?: string;
  certificateNumber: string;
  issueDate: string;
  finalScore: number;
}

export const CertificateView = ({
  userName,
  courseName,
  moduleName,
  certificateNumber,
  issueDate,
  finalScore
}: CertificateViewProps) => {
  const handleDownload = () => {
    // This will be implemented with PDF generation
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-4 border-primary/30 certificate-card">
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Award className="w-24 h-24 text-primary" />
            </div>
            
            <div>
              <h1 className="text-5xl font-black gradient-text mb-2">Certificate of Achievement</h1>
              <p className="text-muted-foreground">This certifies that</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-2">{userName}</h2>
              <p className="text-lg text-muted-foreground">has successfully completed</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{courseName}</h3>
              {moduleName && (
                <p className="text-xl text-muted-foreground">{moduleName}</p>
              )}
            </div>

            <div className="flex justify-center gap-12 pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Final Score</p>
                <p className="text-2xl font-bold text-primary">{finalScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                <p className="text-2xl font-bold">{new Date(issueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">Certificate Number: {certificateNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={handleDownload} className="gap-2">
          <Download className="w-5 h-5" />
          Download Certificate
        </Button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-card, .certificate-card * {
            visibility: visible;
          }
          .certificate-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

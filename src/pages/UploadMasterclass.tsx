import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, CheckCircle2 } from "lucide-react";

const UploadMasterclass = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("reset-discipline");
  const [selectedModule, setSelectedModule] = useState<string>("1");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate all files
    for (const file of fileArray) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a video file`,
          variant: "destructive",
        });
        return;
      }
      if (file.size > 524288000) {
        toast({
          title: "File too large",
          description: `${file.name} must be under 500MB`,
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);

    try {
      const bucketName = selectedCourse === "reset-discipline" 
        ? "reset-discipline-course" 
        : "masterclass-videos";

      const uploaded: string[] = [];
      const totalFiles = fileArray.length;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const lessonNumber = i + 1;

        let filePath = "";
        if (selectedCourse === "reset-discipline") {
          filePath = `module${selectedModule}-lesson${lessonNumber}.mp4`;
        } else {
          filePath = `mental-mastery/${file.name}`;
        }

        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;

        uploaded.push(filePath);
        setUploadedFiles([...uploaded]);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      setUploadComplete(true);
      toast({
        title: "All uploads successful!",
        description: `${uploaded.length} videos uploaded for Module ${selectedModule}`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload videos",
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
            <CardTitle className="text-2xl">Upload Course Video</CardTitle>
            <CardDescription>
              Upload videos for Reset by Discipline course or other masterclasses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reset-discipline">Reset by Discipline Course</SelectItem>
                    <SelectItem value="mental-mastery">Mental Mastery Masterclass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCourse === "reset-discipline" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Module</label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Module 1: Getting Fit</SelectItem>
                      <SelectItem value="2">Module 2: Knowing Who You Are</SelectItem>
                      <SelectItem value="3">Module 3: Become Your Own Boss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
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
                      multiple
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
                        {uploading ? "Uploading..." : "Choose Video Files"}
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select multiple videos • Supports MP4, WebM, MOV (Max 500MB each)
                  </p>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Uploading {uploadedFiles.length} files...
                      </span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    {uploadedFiles.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Completed: {uploadedFiles.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  {uploadedFiles.length} videos uploaded for Module {selectedModule}
                </p>
                <div className="text-xs text-muted-foreground mb-6 max-w-md mx-auto">
                  {uploadedFiles.map((file, i) => (
                    <div key={i}>{file}</div>
                  ))}
                </div>
                <Button onClick={() => navigate("/dashboard")} variant="hero">
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-card rounded-lg border">
          <h4 className="font-semibold mb-2">Upload Instructions</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {selectedCourse === "reset-discipline" ? (
              <>
                <li>Select all videos for a module (up to 6 lessons)</li>
                <li>Videos will be named: module{selectedModule}-lesson1.mp4, module{selectedModule}-lesson2.mp4, etc.</li>
                <li>Upload order determines lesson numbers (1-6)</li>
                <li>18 total videos needed (3 modules × 6 lessons)</li>
              </>
            ) : (
              <>
                <li>Select multiple videos to upload at once</li>
                <li>Videos stored securely in your backend</li>
                <li>Each lesson references specific timestamps</li>
                <li>Interactive elements trigger after each segment</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadMasterclass;

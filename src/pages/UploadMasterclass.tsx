import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, CheckCircle2 } from "lucide-react";

const UploadMasterclass = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("reset-discipline");
  const [selectedModule, setSelectedModule] = useState<string>("1");
  const [selectedLesson, setSelectedLesson] = useState<string>("1");

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
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      let bucketName = "masterclass-videos";
      let filePath = "";

      if (selectedCourse === "reset-discipline") {
        bucketName = "reset-discipline-course";
        filePath = `module${selectedModule}-lesson${selectedLesson}.mp4`;
      } else {
        filePath = `mental-mastery/${file.name}`;
      }

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      setUploadComplete(true);
      toast({
        title: "Upload successful!",
        description: `Video uploaded as ${filePath}`,
      });

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

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
                <>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lesson</label>
                    <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lesson" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Lesson 1</SelectItem>
                        <SelectItem value="2">Lesson 2</SelectItem>
                        <SelectItem value="3">Lesson 3</SelectItem>
                        <SelectItem value="4">Lesson 4</SelectItem>
                        <SelectItem value="5">Lesson 5</SelectItem>
                        <SelectItem value="6">Lesson 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
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
          <h4 className="font-semibold mb-2">Upload Instructions</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {selectedCourse === "reset-discipline" ? (
              <>
                <li>✓ Upload each lesson video separately (18 total)</li>
                <li>✓ Select Module and Lesson number before uploading</li>
                <li>✓ File will be named: module{selectedModule}-lesson{selectedLesson}.mp4</li>
                <li>✓ Each lesson should cover its specific content and timestamps</li>
              </>
            ) : (
              <>
                <li>✓ Video will be stored securely in your backend</li>
                <li>✓ 12 lessons will reference specific timestamps</li>
                <li>✓ Each lesson plays only its designated segment</li>
                <li>✓ Interactive elements trigger after each segment</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadMasterclass;

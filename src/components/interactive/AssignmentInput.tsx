import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Save } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface AssignmentInputProps {
  actionStep: string;
  savedResponses?: Record<string, string>;
  onSave: (responses: Record<string, string>) => Promise<void>;
}

export const AssignmentInput = ({ actionStep, savedResponses = {}, onSave }: AssignmentInputProps) => {
  const [responses, setResponses] = useState<Record<string, string>>(savedResponses);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setResponses(savedResponses);
  }, [savedResponses]);

  // Parse the action step to extract assignments
  const parseAssignments = (text: string) => {
    const assignments: { id: string; title: string; description: string }[] = [];
    const lines = text.split('\n');
    let currentAssignment: { id: string; title: string; description: string } | null = null;

    lines.forEach((line) => {
      const assignmentMatch = line.match(/\*\*Assignment\s+(\d+)\s*[–-]\s*([^*]+)\*\*/);
      if (assignmentMatch) {
        if (currentAssignment) {
          assignments.push(currentAssignment);
        }
        const id = `assignment_${assignmentMatch[1]}`;
        const title = assignmentMatch[1];
        currentAssignment = { id, title, description: '' };
      } else if (currentAssignment && line.trim()) {
        currentAssignment.description += (currentAssignment.description ? '\n' : '') + line;
      }
    });

    if (currentAssignment) {
      assignments.push(currentAssignment);
    }

    return assignments;
  };

  const assignments = parseAssignments(actionStep);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onSave(responses);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResponseChange = (id: string, value: string) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const hasUnsavedChanges = JSON.stringify(responses) !== JSON.stringify(savedResponses);

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{assignment.title}</span>
            </div>
            <div className="flex-1">
              <MarkdownRenderer 
                content={assignment.description} 
                className="text-muted-foreground"
              />
            </div>
          </div>
          
          <Textarea
            placeholder="Write your response here..."
            value={responses[assignment.id] || ''}
            onChange={(e) => handleResponseChange(assignment.id, e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </Card>
      ))}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving}
          className="gap-2"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Assignments'}
            </>
          )}
        </Button>
        {hasUnsavedChanges && !savedSuccess && (
          <span className="text-sm text-muted-foreground">
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

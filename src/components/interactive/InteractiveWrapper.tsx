import { SelfDiagnostic } from "./SelfDiagnostic";
import { PassengerDriver } from "./PassengerDriver";
import { ProcessOutcome } from "./ProcessOutcome";
import { CognitiveSovereignty } from "./CognitiveSovereignty";
import { SliderAssessment } from "./SliderAssessment";
import { StateAssessment } from "./StateAssessment";
import { EnergyAudit } from "./EnergyAudit";
import { TimerChallenge } from "./TimerChallenge";
import { TextInputPair } from "./TextInputPair";
import { DragDropScheduler } from "./DragDropScheduler";
import { DragDropMatch } from "./DragDropMatch";
import { CommitmentCheckbox } from "./CommitmentCheckbox";
import { ActionChecklist } from "./ActionChecklist";

interface InteractiveWrapperProps {
  type: string;
  config: any;
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const InteractiveWrapper = ({ type, config, onComplete, savedResponse }: InteractiveWrapperProps) => {
  switch (type) {
    case "self-diagnostic":
      return <SelfDiagnostic config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "passenger-driver":
      return <PassengerDriver config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "process-outcome":
      return <ProcessOutcome config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "cognitive-sovereignty":
      return <CognitiveSovereignty config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "slider-assessment":
      return <SliderAssessment config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "state-assessment":
      return <StateAssessment config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "energy-audit":
      return <EnergyAudit config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "timer-challenge":
      return <TimerChallenge config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "text-input-pair":
      return <TextInputPair config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "drag-drop-scheduler":
      return <DragDropScheduler config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "drag-drop-match":
      return <DragDropMatch config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "commitment-checkbox":
      return <CommitmentCheckbox config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    case "action-checklist":
      return <ActionChecklist config={config} onComplete={onComplete} savedResponse={savedResponse} />;
    default:
      return (
        <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
          Interactive element: {type} (Coming soon)
        </div>
      );
  }
};
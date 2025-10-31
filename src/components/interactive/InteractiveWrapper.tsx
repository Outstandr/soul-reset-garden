import { SelfDiagnostic } from "./SelfDiagnostic";
import { PassengerDriver } from "./PassengerDriver";
import { ProcessOutcome } from "./ProcessOutcome";
import { CognitiveSovereignty } from "./CognitiveSovereignty";

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
    default:
      return (
        <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
          Interactive element: {type} (Coming soon)
        </div>
      );
  }
};
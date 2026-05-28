import { Check } from "lucide-react";

interface StepInfo {
  id: number;
  shortName: string;
}

interface WizardStepperProps {
  steps: StepInfo[];
  currentStep: number;
}

function StepCircle({ stepId, currentStep }: { stepId: number; currentStep: number }) {
  const isDone = currentStep > stepId;
  const isCurrent = currentStep === stepId;
  const tone = isDone
    ? "bg-success text-primary-foreground"
    : isCurrent
      ? "bg-brand-primary text-primary-foreground"
      : "bg-card text-muted-foreground border border-border";
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${tone}`}
    >
      {isDone ? <Check className="w-5 h-5" /> : stepId}
    </div>
  );
}

function StepConnector({ done }: { done: boolean }) {
  return (
    <div className={`h-0.5 flex-1 mx-2 transition-all ${done ? "bg-success" : "bg-border"}`} />
  );
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className="bg-card border border-border shadow-sm rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <StepCircle stepId={step.id} currentStep={currentStep} />
              <span
                className={`mt-2 text-xs desktop:text-13 text-center ${
                  currentStep === step.id ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step.shortName}
              </span>
            </div>
            {index < steps.length - 1 && <StepConnector done={currentStep > step.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

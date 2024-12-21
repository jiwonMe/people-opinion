import { Check } from 'lucide-react';

type Step = {
  id: number;
  name: string;
};

type StepsProps = {
  steps: Step[];
  currentStep: number;
};

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={`relative ${
                stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id === currentStep
                      ? 'border-2 border-primary'
                      : 'border-2 border-muted'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={`absolute top-4 h-0.5 w-full ${
                      step.id < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
              <span className="absolute -bottom-6 w-max text-sm">
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
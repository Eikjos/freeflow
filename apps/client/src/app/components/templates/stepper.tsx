"use client";

import BadgeStepper from "@components/atoms/badge-stepper";
import { Button } from "@components/ui/button";
import React, { createContext, Fragment, useContext, useState } from "react";
import { cn } from "../../../lib/utils";

type StepperProps = {
  labels: string[];
  components: React.ReactNode[];
  className?: string;
};

type StepperContextType = {
  isValid: boolean;
  data: any;
  setData: (value: any) => void;
  setIsValid: (value: boolean) => void;
};

const StepperContext = createContext<StepperContextType>(null!);

const Stepper = ({ labels, components, className }: StepperProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>();
  const [isValid, setIsValid] = useState(false);
  const nextStep = () => setStep((prev) => prev + 1);
  const previousStep = () => setStep((prev) => prev - 1);

  return (
    <StepperContext.Provider value={{ setIsValid, isValid, data, setData }}>
      <div
        className={cn(
          "flex flex-row justify-center items-start mb-5",
          className
        )}
      >
        {labels.map((label, index) => {
          return (
            <Fragment key={index}>
              <BadgeStepper
                label={label}
                number={index + 1}
                active={index === step}
              />
              {index < labels.length - 1 && (
                <div className="w-56 border-dashed-spaces h-20" />
              )}
            </Fragment>
          );
        })}
      </div>
      {components[step]}
      <div
        className={cn("flex flex-row w-3/4 mx-auto mt-5", {
          "justify-between": step > 0 && step < labels.length,
          "justify-end": step === 0,
          "justify-start": step === labels.length - 1,
        })}
      >
        {step > 0 && (
          <Button onClick={previousStep}>
            <span className="text-2xl pb-1">&lsaquo;</span> Precedent
          </Button>
        )}
        {step < labels.length - 1 && (
          <Button onClick={nextStep} disabled={!isValid}>
            Suivant <span className="text-2xl pb-1">&rsaquo;</span>
          </Button>
        )}
      </div>
    </StepperContext.Provider>
  );
};

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error(
      "useStepper doit être utilisé à l'intérieur de StepperProvider"
    );
  }
  return context;
};

export { Stepper, useStepper };

'use client';

import BadgeStepper from '@components/atoms/badge-stepper';
import { Button } from '@components/ui/button';
import React, { Fragment, useState } from 'react';
import { cn } from '../../../lib/utils';

type StepperProps = {
  labels: string[];
  components: React.ReactNode[];
  className?: string;
  isValid: boolean;
};

const Stepper = ({ isValid, labels, components, className }: StepperProps) => {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep((prev) => prev + 1);
  const previousStep = () => setStep((prev) => prev - 1);

  return (
    <>
      <div
        className={cn(
          'flex flex-row justify-center items-start mb-5',
          className,
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
        className={cn('flex flex-row w-3/4 mx-auto mt-5', {
          'justify-between': step > 0 && step < labels.length,
          'justify-end': step === 0,
          'justify-start': step === labels.length - 1,
        })}
      >
        {step > 0 && (
          <Button onClick={previousStep}>
            <span className="text-2xl pb-1">&lsaquo;</span> Précédent
          </Button>
        )}
        {step < labels.length - 1 && (
          <Button onClick={nextStep} disabled={!isValid}>
            Suivant <span className="text-2xl pb-1">&rsaquo;</span>
          </Button>
        )}
      </div>
    </>
  );
};

export { Stepper };

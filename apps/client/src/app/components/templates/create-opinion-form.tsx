'use client';

import StarRating from '@components/molecules/start-rating';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import { Form } from '@components/ui/form';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateOpinionData,
  CreateOpinionDataValidation,
} from '@repo/shared-types';
import { createOpinion } from 'actions/opinion';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type CreateOpinionFormProps = {
  entepriseId: number;
};

export default function CreateOpinionForm({
  entepriseId,
}: CreateOpinionFormProps) {
  const router = useRouter();
  const form = useForm<CreateOpinionData>({
    defaultValues: {
      content: '',
      rate: 0,
    },
    resolver: zodResolver(CreateOpinionDataValidation),
  });

  const onSubmit = (values: CreateOpinionData) => {
    createOpinion(entepriseId, values)
      .then((res) => {
        toast.success("L'avis a bien été envoyé.");
        router.replace('/customers/dashboard');
      })
      .catch((e: Error) => {
        toast.error(e.message);
      });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <Card className="w-3/4 mx-auto mt-10 p-5">
          <CardContent className="flex flex-row items-center gap-4">
            <Controller
              name="rate"
              control={form.control}
              render={({ field }) => (
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                  withValueDisplay
                />
              )}
            />
            <Separator
              orientation="vertical"
              className="bg-secondary h-[300px]"
            />
            <div className="w-full flex flex-col justify-between h-full gap-7">
              <Textarea
                label={"Contenu de l'avis"}
                className="w-full min-h-[200px]"
                {...form.register('content')}
              />
              <Button className="w-1/4 mx-auto">Soumettre</Button>
            </div>
          </CardContent>
        </Card>
      </Form>
    </form>
  );
}

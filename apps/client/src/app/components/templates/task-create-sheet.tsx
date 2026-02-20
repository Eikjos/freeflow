import { Button } from '@components/ui/button';
import { Editor, uploadAndReplace } from '@components/ui/editor';
import { Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import InputFile from '@components/ui/input-file';
import { Select } from '@components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateTaskData,
  CreateTaskValidation,
  TaskData,
} from '@repo/shared-types';
import { createTask } from 'actions/tasks';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TaskCreateSheetProps = {
  open: boolean;
  columnId: number;
  onClose: () => void;
  onAddTask: (task: TaskData) => void;
};

export default function TaksCreateSheet({
  open,
  onClose,
  columnId,
  onAddTask,
}: TaskCreateSheetProps) {
  const t = useTranslations();
  const form = useForm<CreateTaskData>({
    resolver: zodResolver(CreateTaskValidation),
    defaultValues: {
      name: '',
      estimation: 0,
      description: '',
      files: [],
    },
  });
  const onSubmit = async (values: CreateTaskData) => {
    try {
      if (values.description) {
        const newValue = await uploadAndReplace(values.description);
        if (newValue) {
          values.description = newValue.value;
          values.mediaIds = newValue.images;
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error('uploaded ' + e.message);
      }
    }
    createTask(columnId, values, form.getValues('files'))
      .then((res) => {
        if (res) {
          onAddTask(res);
        }
      })
      .then(() => form.reset())
      .catch((e: Error) => toast.error(e.message))
      .finally(() => onClose());
  };

  const handleUploadFile = (files: File[]) => {
    form.setValue('files', files, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto pb-5">
        <SheetHeader>
          <SheetTitle className="text-3xl font-medium font-amica">
            {t('task.createTitle')}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center mt-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              label={t('common.name')}
              placeholder={t('task.namePlaceholder')}
              {...form.register('name')}
            />
            <Editor
              className="mt-3 mb-4"
              label={t('common.description')}
              placeholder={t('common.enterDescription')}
              {...form.register('description')}
            />
            <Select
              label={t('task.priority')}
              values={[
                { value: 'HIGH', textValue: 'Élevé' },
                { value: 'MEDIUM', textValue: 'Moyen' },
                { value: 'LOW', textValue: 'Faible' },
              ]}
              placeholder={t('task.priority')}
              {...form.register('priority')}
            />
            <Input
              type="number"
              label={t('task.estimation')}
              placeholder={t('task.estimation')}
              {...form.register('estimation')}
            />
            <InputFile
              className="w-full mt-3"
              multiple
              onFilesSelected={handleUploadFile}
              showFiles
            />
            <Button type="submit" className="w-full mt-10">
              {t('common.create')}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

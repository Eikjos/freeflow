import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select } from "@components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskData,
  CreateTaskValidation,
  TaskData,
} from "@repo/shared-types";
import { createTask } from "actions/tasks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TaskCreateSheetProps = {
  open: boolean;
  columnId: number;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onAddTask: (task: TaskData) => void;
};

export default function TaksCreateSheet({
  open,
  onClose,
  columnId,
  onAddTask,
}: TaskCreateSheetProps) {
  const form = useForm<CreateTaskData>({
    resolver: zodResolver(CreateTaskValidation),
    defaultValues: {
      name: "",
      estimation: 0,
    },
  });

  const onSubmit = (values: CreateTaskData) => {
    createTask(columnId, values)
      .then((res) => {
        if (res) {
          onAddTask(res);
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => onClose());
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-3xl font-medium font-amica">
            Création d'une tâche
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center mt-10 h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              label="Nom"
              placeholder="Nom de la tâche"
              {...form.register("name")}
            />
            <Input
              type="text"
              label="Description"
              placeholder="Description"
              {...form.register("description")}
            />
            <Select
              label="Priorité"
              values={[
                { value: "HIGH", textValue: "Élevé" },
                { value: "MEDIUM", textValue: "Moyen" },
                { value: "LOW", textValue: "Faible" },
              ]}
              placeholder="Priorité"
              {...form.register("priority")}
            />
            <Input
              type="number"
              label="Estimation"
              placeholder="Estimation"
              {...form.register("estimation")}
            />
            <Button type="submit" className="w-full mt-10">
              Créer
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

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
import { useForm } from "react-hook-form";

type TaskCreateSheetProps = {
  open: boolean;
  columnId: number;
  onClose: () => void;
};

export default function TaksCreateSheet({
  open,
  onClose,
  columnId,
}: TaskCreateSheetProps) {
  const form = useForm();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-3xl font-medium font-amica">
            Création d'une tâche
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form className="flex flex-col items-center mt-10 h-full">
            <Input
              name="name"
              type="text"
              label="Nom"
              placeholder="Nom de la tâche"
            />
            <Input
              type="text"
              label="Description"
              name="description"
              placeholder="Description"
            />
            <Select
              label="Priorité"
              name="priority"
              values={[]}
              placeholder="Priorité"
            />
            <Input
              type="number"
              name="estimate"
              label="Estimation"
              placeholder="Estimation"
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

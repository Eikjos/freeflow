import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { TaskData } from "@repo/shared-types";

type TaskDetailSheetProps = {
  task: TaskData;
  open: boolean;
  onClose: () => void;
};

export default function TaskDetailSheet({
  task,
  open,
  onClose,
}: TaskDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="text-3xl font-medium font-amica">
          <SheetTitle>Détail</SheetTitle>
        </SheetHeader>
        {task.name}
      </SheetContent>
    </Sheet>
  );
}

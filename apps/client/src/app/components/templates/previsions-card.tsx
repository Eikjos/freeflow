import { Card, CardContent, CardHeader } from "@components/ui/card";
import { cn } from "../../../lib/utils";
import PrevisionCAChart from "./prevision-chart";

type PrevisionsCardProps = {
  className?: string;
};

export default function PrevisionsCard({ className }: PrevisionsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-0">
        <CardHeader>Les prévisions du chiffre d'afffaire</CardHeader>
        <PrevisionCAChart className="mx-3" />
      </CardContent>
    </Card>
  );
}

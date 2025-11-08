import { ObjectiveData } from "@repo/shared-types";
import dayjs from "dayjs";
import PieChart from "./pie-chart";

type ObjectiveChartProps = {
  objective: ObjectiveData;
};

export default function ObjectiveChart({ objective }: ObjectiveChartProps) {
  return (
    <div>
      <div className="flex flex-row justify-between items-baseline">
        <span className="text-black">
          {objective.objectiveCategory == "SALES"
            ? "Chiffre d'affaire"
            : "Client"}
        </span>
        <span className="text-sm text-gray-500">
          {dayjs(objective.startDate).format("DD/MM/YYYY")} -{" "}
          {dayjs(objective.endDate).format("DD/MM/YYYY")}
        </span>
      </div>
      <PieChart
        data={[
          {
            name:
              objective.objectiveCategory === "SALES"
                ? "Chiffre d'affaire"
                : "Client",
            value: objective.currentNumber,
          },
          {
            name: "Restant",
            value: objective.objectiveNumber - objective.currentNumber,
          },
        ]}
        colors={["#3e6450", "#fea052"]}
        className="h-[300px]"
        type={objective.objectiveCategory === "SALES" ? "PRICE" : "DEFAULT"}
      />
    </div>
  );
}

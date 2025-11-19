"use client";
import Slider from "@components/molecules/slider";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import Loading from "@components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { getInProgressObjectiveQueryOptions } from "../../../lib/api/objectives";
import { cn } from "../../../lib/utils";
import ObjectiveChart from "./objective-chart";

type ObjectiveCardProps = {
  className?: string;
};

export default function ObjectiveCard({ className }: ObjectiveCardProps) {
  const { data, isLoading } = useQuery(getInProgressObjectiveQueryOptions());

  return (
    <Card className={cn("p-0", className)}>
      <CardContent className="py-0 px-5 w-full">
        <CardHeader className="px-0">Mes objectifs</CardHeader>
        {isLoading && (
          <div className="w-full h-[300px] flex flex-row justify-center items-center">
            <Loading />
          </div>
        )}
        {!isLoading &&
          (data?.data === undefined || data?.data.length === 0) && (
            <div className="w-full h-[300px] flex flex-row justify-center items-center">
              <span className="text-sm text-gray-500">
                Aucun objectifs en cours
              </span>
            </div>
          )}
        {data?.data && data.data.length > 0 && (
          <Slider
            autoSlide={false}
            autoSlideInterval={4000}
            className="h-[320px]"
          >
            {data?.data?.map((o, i) => (
              <ObjectiveChart objective={o} key={i} />
            ))}
          </Slider>
        )}
      </CardContent>
    </Card>
  );
}

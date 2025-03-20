import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { ProjectData } from "@repo/shared-types";
import Image from "next/image";
import { getMediaUrl } from "../../../lib/utils";

type ProjectCardProps = {
  project: ProjectData;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          {project.media && (
            <Image
              src={getMediaUrl(project.media)}
              width={50}
              height={50}
              alt={`Image du projet ${project.name}`}
            />
          )}
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardDescription>Client : {project.customer} </CardDescription>
      </CardContent>
    </Card>
  );
}

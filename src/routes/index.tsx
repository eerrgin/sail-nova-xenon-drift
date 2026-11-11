import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/dj/studio";

export const Route = createFileRoute("/")({
  component: Studio,
});

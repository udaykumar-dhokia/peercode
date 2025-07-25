import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_layout/challenges")({
  component: Challenges,
});

function Challenges() {
  return <div>Hello "/_protected/_layout/challenges"!</div>;
}

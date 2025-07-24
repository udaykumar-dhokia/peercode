import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/_layout/dashboard"!</div>;
}

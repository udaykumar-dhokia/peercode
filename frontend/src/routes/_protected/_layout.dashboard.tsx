import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { UserState } from "../../store/slices/user.slice";

export const Route = createFileRoute("/_protected/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const userData: UserState = useSelector((state: RootState) => state.user);
  console.log(userData);

  return <div>Hello "/_protected/_layout/dashboard"!</div>;
}

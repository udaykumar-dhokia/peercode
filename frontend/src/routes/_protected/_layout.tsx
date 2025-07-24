import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { AppSidebar } from "../../components/custom/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import ProtectedHeader from "../../components/custom/header/ProtectedHeader";
import { store } from "../../store/store";
import { login } from "../../store/slices/user.slice";
import { persistData } from "../../hooks/auth";
import { useState } from "react";
import ChallengeDrawer from "../../components/custom/drawers/ChallengeDrawer";

export const Route = createFileRoute("/_protected/_layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    document.title = "PeerCode";

    const user = await persistData();

    if (!user) {
      throw redirect({ to: "/login" });
    }

    store.dispatch(login(user));
  },
});

function RouteComponent() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] || "Dashboard";

  const title = current.charAt(0).toUpperCase() + current.slice(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <SidebarProvider className={`relative w-full h-screen overflow-hidden`}>
        <AppSidebar
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
        <main
          className={` ${isDialogOpen ? "blur-xs" : ""} p-4 w-full min-h-screen flex flex-col`}
        >
          <div className="gap-4">
            <SidebarTrigger className="hover:cursor-pointer" />
            <ProtectedHeader slug={title} />
          </div>
          <Outlet />
        </main>
        {isDialogOpen && <ChallengeDrawer setIsDialogOpen={setIsDialogOpen} />}
      </SidebarProvider>
    </>
  );
}

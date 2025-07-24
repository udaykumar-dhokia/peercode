import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { AppSidebar } from "../../components/custom/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import ProtectedHeader from "../../components/custom/header/ProtectedHeader";

export const Route = createFileRoute("/_protected/_layout")({
  component: RouteComponent,
  beforeLoad: ({}) => {
    document.title = "PeerCode";
  },
});

function RouteComponent() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] || "Dashboard";

  const title = current.charAt(0).toUpperCase() + current.slice(1);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <div className="flex items-center my-4 gap-4">
            <SidebarTrigger />
            <ProtectedHeader slug={title} />
          </div>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

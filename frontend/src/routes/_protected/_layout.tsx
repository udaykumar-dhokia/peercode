import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { AppSidebar } from "../../components/custom/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import ProtectedHeader from "../../components/custom/header/ProtectedHeader";
import { store, type RootState } from "../../store/store";
import { login } from "../../store/slices/user.slice";
import { persistData } from "../../hooks/auth";
import { useState, useEffect } from "react";
import ChallengeDrawer from "../../components/custom/drawers/ChallengeDrawer";
import { Toaster } from "../../components/ui/sonner";
import { persistChallengeData } from "../../hooks/challenges";
import { setChallenges } from "../../store/slices/challenges.slice";
import { Icons } from "../../assets/icons/icons";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/_protected/_layout")({
  component: ProtectedLayout,
  beforeLoad: async () => {
    document.title = "PeerCode";

    const user = await persistData();
    const challengesData = await persistChallengeData();

    if (!user) {
      throw redirect({ to: "/login" });
    }

    store.dispatch(setChallenges(challengesData));
    store.dispatch(login(user));
  },
});

function ProtectedLayout() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] || "Dashboard";

  const title = current.charAt(0).toUpperCase() + current.slice(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDialogOpen]);

  return (
    <>
      <SidebarProvider
        className={`relative w-full min-h-screen overflow-hidden`}
      >
        <AppSidebar
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
        <main
          className={`p-4 w-full min-h-screen flex flex-col ${
            isDialogOpen ? "overflow-hidden blur-xs" : ""
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <SidebarTrigger className="hover:cursor-pointer" />
              <div className="flex items-center">
                <Icons.Energy /> {userData.user?.stats.winStreak}
              </div>
            </div>
            <ProtectedHeader slug={title} />
          </div>
          <Outlet />
        </main>
        {isDialogOpen && <ChallengeDrawer setIsDialogOpen={setIsDialogOpen} />}
      </SidebarProvider>
      <Toaster closeButton position="top-center" className="rounded-xl" />
    </>
  );
}

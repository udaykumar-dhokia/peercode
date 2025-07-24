import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "../../components/custom/footer/Footer";
import PublicHeader from "../../components/custom/header/PublicHeader";

export const Route = createFileRoute("/_public/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="bg-gradient-to-bl from-second/12 to-white">
        <div className="max-w-[50%] mx-auto min-h-screen">
          <PublicHeader />
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

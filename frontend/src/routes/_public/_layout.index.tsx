import { createFileRoute } from "@tanstack/react-router";
import Hero from "../../components/custom/hero/Hero";

export const Route = createFileRoute("/_public/_layout/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="">
        <Hero />
      </div>
    </>
  );
}

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Toaster } from "../../components/ui/sonner";

export const Route = createFileRoute("/challenge/_layout")({
  component: ChallengeLayout,
});

function ChallengeLayout() {
  const { question } = useSelector((state: RootState) => state.question);
  return (
    <>
      <div className="p-4">
        <nav className="flex items-center justify-between">
          <div className="title flex items-center gap-2">
            <h1 className="text-lg font-bold">{question?.title}</h1>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                question?.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : question?.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {question?.difficulty}
            </span>
          </div>
        </nav>
        <div className="px-1 pt-4 rounded-xl">
          <Outlet />
        </div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}

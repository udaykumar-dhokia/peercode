import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { store, type RootState } from "../../store/store";
import { Toaster } from "../../components/ui/sonner";
import { persistData } from "../../hooks/auth";
import { persistChallengeData } from "../../hooks/challenges";
import { setChallenges } from "../../store/slices/challenges.slice";
import { login } from "../../store/slices/user.slice";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/challenge/_layout")({
  component: ChallengeLayout,
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

function ChallengeLayout() {
  const { question } = useSelector((state: RootState) => state.question);
  const { challenges } = useSelector((state: RootState) => state.challenges);
  const user = useSelector((state: RootState) => state.user.user);

  const currentChallenge = challenges.find((c) => c.question === question?._id);

  const isSender = currentChallenge?.byEmail === user?.email;
  const stats = isSender
    ? currentChallenge?.byStats
    : currentChallenge?.toStats;
  const duration = currentChallenge?.duration;

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!stats?.startedAt || !duration) return;

    const startedAt = new Date(stats.startedAt).getTime();
    const endsAt = startedAt + duration * 60 * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const remaining = Math.max(0, endsAt - now);
      setTimeLeft(Math.floor(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [stats?.startedAt, duration]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="p-4">
        <nav className="flex items-center justify-between">
          <div className="title flex items-center justify-between">
            <div className="flex gap-2">
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
          </div>

          {stats?.startedAt ? (
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">Not started yet</p>
          )}
        </nav>

        <div className="px-1 pt-4 rounded-xl">
          <Outlet />
        </div>

        <Toaster position="top-center" />
      </div>
    </>
  );
}

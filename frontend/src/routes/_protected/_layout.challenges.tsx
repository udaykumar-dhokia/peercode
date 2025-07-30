import { createFileRoute } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  acceptChallenge,
  type ChallengeType,
} from "../../store/slices/challenges.slice";
import { Icons } from "../../assets/icons/icons";
import { Input } from "../../components/ui/input";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import AcceptChallenge from "../../components/custom/dialogs/AcceptChallenge";
import StartChallengeDailog from "../../components/custom/dialogs/StartChallengeDailog";
import CountdownTimer from "../../components/custom/timer/CountdownTimer";

export const Route = createFileRoute("/_protected/_layout/challenges")({
  component: Challenges,
});

function Challenges() {
  const challengesData = useSelector((state: RootState) => state.challenges);
  const userData = useSelector((state: RootState) => state.user);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [challengeID, setChallengeID] = useState();
  const dispatch = useDispatch();

  const activeChallenges =
    challengesData?.challenges?.filter(
      (challenge) =>
        challenge.status === "accepted" &&
        challenge.isCompleted === false &&
        (challenge.toEmail === userData.user?.email ||
          challenge.byEmail === userData.user?.email)
    ) || [];

  const activeChallengesCount = challengesData?.challenges?.filter(
    (challenge: ChallengeType) =>
      challenge.isCompleted === false && challenge.status === "accepted"
  ).length;

  const totalChallengesCount = challengesData?.challenges?.filter(
    (challenge: ChallengeType) =>
      challenge.isCompleted === false &&
      challenge.byEmail === userData.user?.email
  ).length;

  const totalChallengesReceivedCount = challengesData?.challenges?.filter(
    (challenge: ChallengeType) =>
      challenge.isCompleted === false &&
      challenge.toEmail === userData.user?.email
  ).length;

  const stats = [
    {
      title: "Active",
      value: activeChallengesCount,
      icon: Icons.Code,
    },
    {
      title: "Created",
      value: totalChallengesCount,
      icon: Icons.Code,
    },
    {
      title: "Received",
      value: totalChallengesReceivedCount,
      icon: Icons.Code,
    },
    {
      title: "Total Wins",
      value: userData.user?.stats.wins,
      icon: Icons.Crown,
    },
  ];

  const handleAcceptChallenge = async (
    challengeId: any,
    category: string,
    difficulty: string
  ) => {
    if (!category || !challengeId || !difficulty) {
      return;
    }
    setChallengeID(challengeId);
    setIsAccepting(true);
    const payload = {
      challengeID: challengeId,
      category: category,
      difficulty: difficulty,
    };
    try {
      const res = await axiosInstance.post("/challenge/accept", payload);
      dispatch(acceptChallenge({ id: challengeId }));
      toast.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsAccepting(false);
    }
  };

  const yourChallenges =
    challengesData?.challenges?.filter(
      (challenge) =>
        challenge.byEmail === userData.user?.email &&
        challenge.status != "accepted"
    ) || [];

  const incomingChallenges =
    challengesData?.challenges?.filter(
      (challenge) =>
        challenge.toEmail === userData.user?.email &&
        challenge.status !== "accepted"
    ) || [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-10 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl bg-neutral-100 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-2">
              <stat.icon />
              <h2 className="text-lg font-semibold text-gray-700">
                {stat.title}
              </h2>
            </div>
            <p className="text-5xl font-bold text-right bg-gradient-to-b from-second/70 to-second bg-clip-text text-transparent">
              {stat.value ?? 0}
            </p>
          </div>
        ))}
      </div>
      <div className="">
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <Tabs defaultValue="your-challenges" className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <TabsList className="flex gap-2 bg-white border p-1 rounded-lg shadow-sm">
                <TabsTrigger value="your-challenges">
                  Your <sup>{yourChallenges.length}</sup>
                </TabsTrigger>
                <TabsTrigger value="incoming-challenges">
                  Incoming <sup>{incomingChallenges.length}</sup>
                </TabsTrigger>
                <TabsTrigger value="active-challenges">
                  Active <sup>{activeChallenges.length}</sup>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 max-w-xs w-full sm:w-[300px]">
                <Icons.Search />
                <Input
                  placeholder="Search your challenges..."
                  className="rounded-xl w-full"
                />
              </div>
            </div>

            <TabsContent value="your-challenges" className="mt-6">
              {yourChallenges.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-lg font-semibold">No Challenges Found</p>
                  <p className="text-sm">
                    You haven't created any challenges yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
                  {yourChallenges.map(
                    (challenge: ChallengeType, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`rounded-xl p-5 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg ${
                          challenge.isCompleted ? "bg-green-50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-500">
                            <span className="text-second">
                              {challenge.category}
                            </span>{" "}
                            • {challenge.difficulty}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              challenge.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : challenge.status === "accepted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {challenge.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <strong>To:</strong> {challenge.toEmail || "User B"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {challenge.duration} min
                          </p>
                        </div>
                        {challenge.note && (
                          <p className="text-sm text-gray-500 italic truncate">
                            “{challenge.note}”
                          </p>
                        )}
                        {!challenge.isCompleted && (
                          <Button variant={"outline"} className="rounded-xl">
                            View
                            <motion.div whileHover={{ x: 1 }} className="">
                              <Icons.DiagonalArrow />
                            </motion.div>
                          </Button>
                        )}
                        {challenge.isCompleted && (
                          <span className="mt-3 inline-block text-xs font-medium text-green-600">
                            ✅ Challenge Completed
                          </span>
                        )}
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="incoming-challenges" className="mt-6">
              {incomingChallenges.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-lg font-semibold">No Challenges Found</p>
                  <p className="text-sm">
                    You haven't received any challenges yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {incomingChallenges.map(
                    (challenge: ChallengeType, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className={`rounded-xl p-5 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg ${
                          challenge.isCompleted ? "bg-green-50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-500">
                            <span className="text-second">
                              {challenge.category}
                            </span>{" "}
                            • {challenge.difficulty}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              challenge.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : challenge.status === "accepted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {challenge.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <strong>From:</strong>{" "}
                            {challenge.byEmail || "User A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {challenge.duration} min
                          </p>
                        </div>
                        {challenge.note && (
                          <p className="text-sm text-gray-500 italic truncate">
                            “{challenge.note}”
                          </p>
                        )}
                        {!challenge.isCompleted && (
                          <div className="flex gap-1">
                            <Button
                              size={"sm"}
                              className="mb-4 hover:cursor-pointer border rounded-full bg-white/90 text-black inset-shadow-sm inset-shadow-white/60 hover:bg-red-200/90"
                            >
                              <motion.div whileHover={{ x: 1 }} className="">
                                <Icons.XMark />
                              </motion.div>
                            </Button>
                            <AcceptChallenge
                              challenge={challenge}
                              challengeID={challengeID}
                              handleAcceptChallenge={handleAcceptChallenge}
                              isAccepting={isAccepting}
                            />
                          </div>
                        )}
                        {challenge.isCompleted && (
                          <span className="mt-3 inline-block text-xs font-medium text-green-600">
                            ✅ Challenge Completed
                          </span>
                        )}
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active-challenges" className="mt-6">
              {activeChallenges.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-lg font-semibold">No Active Challenges</p>
                  <p className="text-sm">
                    Accepted challenges will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {activeChallenges.map(
                    (challenge: ChallengeType, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="rounded-xl p-5 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-500">
                            <span className="text-second">
                              {challenge.category}
                            </span>{" "}
                            • {challenge.difficulty}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            Active
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <strong>Opponent:</strong>{" "}
                            {challenge.byEmail === userData.user?.email
                              ? challenge.toEmail
                              : challenge.byEmail}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {challenge.duration} min
                          </p>
                        </div>
                        {challenge.note && (
                          <p className="text-sm text-gray-500 italic truncate">
                            “{challenge.note}”
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="mt-4">
                            {(() => {
                              const isSender =
                                challenge.byEmail === userData.user?.email;
                              const startedAt = isSender
                                ? challenge.byStats?.startedAt
                                : challenge.toStats?.startedAt;

                              return startedAt ? (
                                <CountdownTimer
                                  start={startedAt}
                                  duration={challenge.duration}
                                />
                              ) : null;
                            })()}
                          </div>

                          <StartChallengeDailog
                            duration={challenge.duration}
                            challenge={challenge}
                            email={userData.user?.email}
                          />
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

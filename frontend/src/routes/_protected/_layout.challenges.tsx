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
      title: "Active Challenges",
      value: activeChallengesCount,
      icon: Icons.Code,
    },
    {
      title: "Challenges Created",
      value: totalChallengesCount,
      icon: Icons.Code,
    },
    {
      title: "Challenges Received",
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
            <p className="text-4xl font-bold text-right text-second">
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
                  Your Challenges
                </TabsTrigger>
                <TabsTrigger value="incoming-challenges">
                  Incoming Challenges
                </TabsTrigger>
                <TabsTrigger value="active-challenges">
                  Active Challenges
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
                            <Button
                              onClick={() => {
                                handleAcceptChallenge(
                                  challenge._id,
                                  challenge.category,
                                  challenge.difficulty
                                );
                              }}
                              size={"sm"}
                              className=" mb-4 hover:cursor-pointer rounded-xl bg-green-600/90 inset-shadow-sm inset-shadow-white/60"
                            >
                              {isAccepting &&
                              challengeID == challenge._id?.toString() ? (
                                <motion.svg
                                  animate={{
                                    rotate: 360,
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "anticipate",
                                  }}
                                  width="25"
                                  height="24"
                                  viewBox="0 0 25 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-white"
                                >
                                  <path
                                    d="M3.03258 9.54078C2.92537 9.94088 3.16281 10.3521 3.56291 10.4593C3.96301 10.5665 4.37426 10.3291 4.48147 9.92901C4.93723 8.22807 5.94152 6.72504 7.33857 5.65305C8.73562 4.58106 10.4474 4 12.2083 4C13.9692 4 15.681 4.58106 17.078 5.65305C18.2961 6.58769 19.2156 7.84997 19.7332 9.28541L18.0581 8.34216C17.6972 8.13893 17.2398 8.26676 17.0366 8.62769C16.8334 8.98862 16.9612 9.44596 17.3221 9.64919L20.4028 11.3839C20.5762 11.4815 20.7812 11.5063 20.9728 11.4527C21.1643 11.3991 21.3268 11.2717 21.4244 11.0983L23.159 8.0173C23.3622 7.65636 23.2343 7.19903 22.8734 6.99582C22.5125 6.79261 22.0551 6.92047 21.8519 7.28141L21.0911 8.63274C20.4676 6.98764 19.3968 5.54161 17.9912 4.46302C16.3322 3.19001 14.2994 2.5 12.2083 2.5C10.1172 2.5 8.08444 3.19001 6.42543 4.46302C4.76641 5.73603 3.57381 7.52089 3.03258 9.54078Z"
                                    fill="#fff"
                                  />
                                  <path
                                    opacity="0.4"
                                    d="M21.3871 14.4577C21.4943 14.0576 21.2568 13.6464 20.8567 13.5392C20.4566 13.432 20.0454 13.6694 19.9382 14.0695C19.4824 15.7705 18.4781 17.2735 17.0811 18.3455C15.684 19.4175 13.9723 19.9985 12.2114 19.9985C10.4504 19.9985 8.73868 19.4175 7.34163 18.3455C6.12569 17.4125 5.20728 16.1529 4.68909 14.7206L6.35177 15.6568C6.7127 15.86 7.17004 15.7322 7.37328 15.3713C7.57651 15.0103 7.44868 14.553 7.08775 14.3498L4.00704 12.615C3.83371 12.5174 3.62871 12.4927 3.43713 12.5462C3.24555 12.5998 3.0831 12.7273 2.98551 12.9006L1.25089 15.9816C1.04768 16.3426 1.17554 16.7999 1.53648 17.0031C1.89743 17.2063 2.35476 17.0785 2.55797 16.7175L3.32471 15.3557C3.94764 17.005 5.01996 18.4547 6.42848 19.5355C8.0875 20.8085 10.1202 21.4985 12.2114 21.4985C14.3025 21.4985 16.3352 20.8085 17.9942 19.5355C19.6532 18.2625 20.8458 16.4776 21.3871 14.4577Z"
                                    fill="#fff"
                                  />
                                </motion.svg>
                              ) : (
                                <motion.div whileHover={{ x: 1 }} className="">
                                  <Icons.RightArrow />
                                </motion.div>
                              )}
                            </Button>
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
                        <Button
                          variant={"default"}
                          className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all"
                          onClick={() => {
                            // You can navigate to the challenge screen or start logic here
                            toast.success("Challenge started (demo)");
                          }}
                        >
                          Start
                          <motion.div whileHover={{ x: 2 }} className="">
                            <Icons.RightArrow />
                          </motion.div>
                        </Button>
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

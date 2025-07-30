import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { motion } from "motion/react";
import { Icons } from "../../../assets/icons/icons";
import { useState } from "react";
import type { ChallengeType } from "../../../store/slices/challenges.slice";
import { toast } from "sonner";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "@tanstack/react-router";

interface StartChallengeProps {
  duration: number;
  challenge: ChallengeType;
  email: string | undefined;
}
const StartChallengeDailog = ({
  duration,
  challenge,
  email,
}: StartChallengeProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  const isByUser = challenge.byEmail === email;
  const isToUser = challenge.toEmail === email;

  const alreadyStarted =
    (isByUser && challenge.byStats?.startedAt) ||
    (isToUser && challenge.toStats?.startedAt);

  const handleStartChallenge = async () => {
    if (!duration || !challenge || !email) return;
    setIsStarting(true);

    try {
      const payload = {
        duration,
        challengeID: challenge._id,
        email,
      };
      const res = await axiosInstance.post("/challenge/start", payload);
      toast.success(res.data.message);
      navigate({ to: `/challenge/${challenge.question}` });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error starting challenge");
    } finally {
      setIsStarting(false);
    }
  };

  if (alreadyStarted) {
    return (
      <Button
        onClick={() => navigate({ to: `/challenge/${challenge.question}` })}
        className="hover:cursor-pointer mt-4 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all"
      >
        Code
        <motion.div whileHover={{ x: 2 }} className="ml-1">
          <Icons.RightArrow />
        </motion.div>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="hover:cursor-pointer mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all"
        >
          Start
          <motion.div whileHover={{ x: 2 }} className="ml-1">
            <Icons.RightArrow />
          </motion.div>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Challenge?</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            By starting this challenge, you agree to the following:
            <ul className="list-disc list-inside mt-3 space-y-2 text-sm text-gray-700">
              <li>
                You must complete the challenge within the next{" "}
                <strong>{duration} minutes</strong>.
              </li>
              <li>
                Once started, <strong>you cannot reject or undo</strong> this
                action.
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl hover:cursor-pointer"
            onClick={handleStartChallenge}
            disabled={isStarting}
          >
            {isStarting ? (
              <motion.svg
                animate={{ rotate: 360 }}
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
              ></motion.svg>
            ) : (
              "Start"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartChallengeDailog;

import { motion } from "motion/react";
import { Icons } from "../../../assets/icons/icons";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "sonner";

type ChallengeDrawerProps = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const difficultyLevels = ["Easy", "Medium", "Hard"];

const categories = [
  "Array",
  "String",
  "Hash Table",
  "Dynamic Programming",
  "Math",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Tree",
  "Breadth-First Search",
  "Bit Manipulation",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Binary Tree",
  "Graph",
  "Stack",
  "Counting",
  "Sliding Window",
  "Design",
  "Enumeration",
  "Backtracking",
  "Union Find",
  "Linked List",
  "Number Theory",
  "Ordered Set",
  "Monotonic Stack",
  "Segment Tree",
  "Trie",
  "Combinatorics",
  "Bitmask",
  "Queue",
  "Recursion",
  "Divide and Conquer",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Hash Function",
  "Binary Search Tree",
  "Shortest Path",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Randomized",
  "Merge Sort",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Line Sweep",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
];

const minDurations: Record<string, number> = {
  Easy: 20,
  Medium: 40,
  Hard: 60,
};

const maxDurations: Record<string, number> = {
  Easy: 40,
  Medium: 60,
  Hard: 80,
};

const ChallengeDrawer = ({ setIsDialogOpen }: ChallengeDrawerProps) => {
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [opponentEmail, setOpponentEmail] = useState("");
  const [opponentExists, setOpponentExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleCreateChallenge = async () => {
    if (!opponentId || !difficulty || !category) {
      return;
    }
    try {
      const payload = {
        to: opponentId,
        category: category,
        difficulty: difficulty,
        duration: duration,
        note: message,
      };
      const res = await axiosInstance.post("/challenge/create", payload);
      setIsDialogOpen(false);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!opponentEmail || !opponentEmail.includes("@")) {
      setOpponentExists(null);
      return;
    }

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await axiosInstance.get(
          `/user/exists?email=${encodeURIComponent(opponentEmail)}`,
          { signal: controller.signal }
        );
        setOpponentExists(true);
        setOpponentId(res.data.userId);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setOpponentExists(false);
          setOpponentId(null);
        } else {
          setOpponentExists(null);
          setOpponentId(null);
        }
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [opponentEmail]);

  const handleDurationChange = (value: string) => {
    const num = Number(value);
    const min = difficulty ? minDurations[difficulty] : 0;
    const max = difficulty ? maxDurations[difficulty] : Infinity;

    if (!isNaN(num)) {
      if (num < min) setDuration(min);
      else if (num > max) setDuration(max);
      else setDuration(num);
    }
  };

  const min = difficulty ? minDurations[difficulty] : 0;
  const max = difficulty ? maxDurations[difficulty] : Infinity;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 right-0 h-full w-[30vw] bg-neutral-100 shadow-sm z-50 p-4 border-l-2 flex flex-col gap-6 justify-between"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Create <span className="text-second">Challenge</span>
        </h1>
        <button onClick={() => setIsDialogOpen(false)}>
          <Icons.XMark />
        </button>
      </div>

      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          Invite a peer to solve a problem. Select difficulty and category to
          generate a challenge.
        </div>

        <div className="space-y-2">
          <Label>Opponent Email</Label>
          <Input
            value={opponentEmail}
            onChange={(e) => setOpponentEmail(e.target.value)}
            placeholder="e.g. alex@example.com"
            className={`rounded-xl ${!checking && opponentExists ? "border-green-600 focus-visible:ring-green-600" : ""} shadow-none focus-visible:ring-1`}
          />
          {checking && (
            <p className="text-sm text-gray-400">Checking user...</p>
          )}
          {!checking && opponentExists === false && (
            <p className="text-sm text-red-500">
              No user found with that email.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="w-full max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(value) => {
              setDifficulty(value);
              setDuration(minDurations[value]);
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {difficultyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {difficulty && (
            <p className="text-xs text-gray-500">
              Minimum duration for <strong>{difficulty}</strong> is {min}{" "}
              minutes.
            </p>
          )}
        </div>

        <Input
          type="number"
          min={min}
          max={max}
          disabled={!difficulty}
          value={duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          className="rounded-xl"
          placeholder={
            difficulty
              ? `between ${min}-${max} mins`
              : "Select difficulty first"
          }
        />

        {difficulty && (
          <p className="text-xs text-gray-500">
            Duration must be between <strong>{min}</strong> and{" "}
            <strong>{max}</strong> minutes for <strong>{difficulty}</strong>{" "}
            level.
          </p>
        )}

        <div className="space-y-2">
          <Label>Message (optional)</Label>
          <Input
            placeholder="Add a note or special instruction..."
            className="rounded-xl"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateChallenge}
          className="rounded-xl bg-black/90 text-white"
          disabled={
            !difficulty || !category || !opponentEmail || !opponentExists
          }
        >
          <Icons.Plus /> Challenge
        </Button>
      </div>
    </motion.div>
  );
};

export default ChallengeDrawer;

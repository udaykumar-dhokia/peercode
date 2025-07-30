import { createFileRoute, redirect } from "@tanstack/react-router";
import { persistQuestionData } from "../../hooks/challenges";
import { store, type RootState } from "../../store/store";
import { setLoading, setQuestion } from "../../store/slices/question.slice";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import CodeEditor from "../../components/custom/code-editor/CodeEditor";
import { motion } from "motion/react";

export const Route = createFileRoute("/challenge/_layout/$id")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    store.dispatch(setLoading(true));
    const question = await persistQuestionData(params.id);
    store.dispatch(setLoading(false));
    if (!question) {
      throw redirect({ to: "/challenges" });
    }
    store.dispatch(setQuestion(question));
  },
});

function RouteComponent() {
  const { question, isLoading } = useSelector(
    (state: RootState) => state.question
  );

  if (!question) return null;

  const { description, constraints, testCases } = question;

  if (isLoading || !question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex gap-1">
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
              fill="#000"
            />
            <path
              opacity="0.4"
              d="M21.3871 14.4577C21.4943 14.0576 21.2568 13.6464 20.8567 13.5392C20.4566 13.432 20.0454 13.6694 19.9382 14.0695C19.4824 15.7705 18.4781 17.2735 17.0811 18.3455C15.684 19.4175 13.9723 19.9985 12.2114 19.9985C10.4504 19.9985 8.73868 19.4175 7.34163 18.3455C6.12569 17.4125 5.20728 16.1529 4.68909 14.7206L6.35177 15.6568C6.7127 15.86 7.17004 15.7322 7.37328 15.3713C7.57651 15.0103 7.44868 14.553 7.08775 14.3498L4.00704 12.615C3.83371 12.5174 3.62871 12.4927 3.43713 12.5462C3.24555 12.5998 3.0831 12.7273 2.98551 12.9006L1.25089 15.9816C1.04768 16.3426 1.17554 16.7999 1.53648 17.0031C1.89743 17.2063 2.35476 17.0785 2.55797 16.7175L3.32471 15.3557C3.94764 17.005 5.01996 18.4547 6.42848 19.5355C8.0875 20.8085 10.1202 21.4985 12.2114 21.4985C14.3025 21.4985 16.3352 20.8085 17.9942 19.5355C19.6532 18.2625 20.8458 16.4776 21.3871 14.4577Z"
              fill="#000"
            />
          </motion.svg>
          Spinning up the environment...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="absolute max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Left Panel - Hidden Scrollbar */}
        <div className="md:col-span-6 bg-white p-6 rounded-lg shadow overflow-y-auto max-h-full scrollbar-hide pr-2">
          <div className="prose max-w-none prose-sm sm:prose-base text-gray-700">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Constraints</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {constraints.map((c, i) => (
                <p key={i} className="flex gap-2">
                  {i + 1}) <ReactMarkdown>{c}</ReactMarkdown>
                </p>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Examples</h2>
            <div className="space-y-4 text-sm text-gray-800">
              {testCases.slice(0, 2).map((tc, i) => (
                <div
                  key={i}
                  className="bg-gray-100 p-3 rounded border border-gray-300"
                >
                  <p>
                    <span className="font-medium text-gray-600">Input:</span>{" "}
                    <span className="font-mono">{tc.input}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Output:</span>{" "}
                    <span className="font-mono">{tc.output}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <CodeEditor />
      </div>
    </div>
  );
}

export default RouteComponent;

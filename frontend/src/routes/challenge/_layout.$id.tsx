import { createFileRoute, redirect } from "@tanstack/react-router";
import { persistQuestionData } from "../../hooks/challenges";
import { store, type RootState } from "../../store/store";
import { setQuestion } from "../../store/slices/question.slice";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import CodeEditor from "../../components/custom/code-editor/CodeEditor";

export const Route = createFileRoute("/challenge/_layout/$id")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const question = await persistQuestionData(params.id);
    if (!question) {
      throw redirect({ to: "/challenges" });
    }

    store.dispatch(setQuestion(question));
  },
});

function RouteComponent() {
  const questionState = useSelector((state: RootState) => state.question);

  if (!questionState.question) return null;

  const { description, constraints, testCases } = questionState.question;

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

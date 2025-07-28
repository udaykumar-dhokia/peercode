import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "../../ui/button";
import { Icons } from "../../../assets/icons/icons";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

const languageOptions = [
  { label: "JavaScript", value: "javascript", judge0Id: 63 },
  { label: "Python", value: "python", judge0Id: 71 },
  { label: "C++", value: "cpp", judge0Id: 54 },
  { label: "Java", value: "java", judge0Id: 62 },
];

type LanguageType = "javascript" | "python" | "cpp" | "java";

const themeOptions = [
  { label: "Dark", value: "vs-dark" },
  { label: "Light", value: "light" },
  { label: "High Contrast Dark", value: "hc-black" },
  { label: "High Contrast Light", value: "hc-light" },
];

type Judge0Status = {
  id: number;
  description: string;
};

type Judge0Response = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status;
  time: string;
  memory: number;
  token: string;
};

export default function CodeEditor() {
  const [language, setLanguage] = useState<LanguageType>("javascript");
  const [code, setCode] = useState("// Write your code here...");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [output, setOutput] = useState<Judge0Response | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { question } = useSelector((state: RootState) => state.question);

  useEffect(() => {
    const templates = {
      javascript: "// JS Starter code",
      python: "# Python Starter",
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}",
      java: "public class Solution {\n  public static void main(String[] args) {}\n}",
    };
    setCode(templates[language]);
  }, [language]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const selectedLang = languageOptions.find(
      (lang) => lang.value === language
    );
    const judge0LangId = selectedLang?.judge0Id;

    if (!judge0LangId || !question?.testCases?.length) {
      setOutput(null);
      return;
    }

    const { input, output: expectedOutput } = question.testCases[0];

    try {
      const response = await fetch(
        "http://localhost:2358/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: judge0LangId,
            stdin: input,
            expected_output: expectedOutput,
          }),
        }
      );

      const result: Judge0Response = await response.json();
      console.log(result);
      setOutput(result);
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="md:col-span-6 bg-white rounded-xl shadow-lg h-full flex flex-col border border-gray-200 overflow-hidden">
      {/* Header: Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div className="flex gap-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="rounded-xl hover:cursor-pointer hover:bg-neutral-200/50 bg-neutral-200"
          >
            {isRunning ? (
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
            ) : (
              <Icons.Run />
            )}
          </Button>
          <Button className="rounded-xl hover:cursor-pointer hover:bg-second/50 bg-second">
            <Icons.Submit /> Submit
          </Button>
        </div>

        {/* Language & Theme Selectors */}
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageType)}
            className="px-2 py-1 text-sm border rounded-md bg-white shadow-sm"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-2 py-1 text-sm border rounded-md bg-white shadow-sm"
          >
            {themeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1/2 overflow-hidden">
        <Editor
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || "")}
          className="rounded-b-xl"
          options={{
            selectionClipboard: false,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>

      {/* Output Box */}
      <div className="p-4 bg-gray-100 border-t text-sm font-mono whitespace-pre-wrap h-48 overflow-auto">
        <strong>Output:</strong>
        <div className="mt-2">
          {!output ? (
            "Waiting for execution..."
          ) : output.status.id === 3 ? (
            output.stdout || "No output."
          ) : output.status.id === 4 ? (
            <div className="text-yellow-600 font-semibold">
              Wrong Answer
              <div className="mt-2 text-black font-normal">
                <div>
                  <strong>Expected:</strong> {question?.testCases[0].output}
                </div>
                <div>
                  <strong>Your Output:</strong> {output.stdout || "No output"}
                </div>
              </div>
            </div>
          ) : output.compile_output ? (
            <span className="text-red-600 font-semibold">
              {output.compile_output}
            </span>
          ) : output.stderr ? (
            <span className="text-red-600 font-semibold">{output.stderr}</span>
          ) : output.message ? (
            <span className="text-red-600 font-semibold">{output.message}</span>
          ) : (
            "Unknown error"
          )}
        </div>
      </div>
    </div>
  );
}

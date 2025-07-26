import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "TypeScript", value: "typescript" },
];

type LanguageType = "javascript" | "python" | "cpp" | "java" | "typescript";

const themeOptions = [
  { label: "Dark", value: "vs-dark" },
  { label: "Light", value: "light" },
  { label: "High Contrast Dark", value: "hc-black" },
  { label: "High Contrast Light", value: "hc-light" },
];

export default function CodeEditor() {
  const [language, setLanguage] = useState<LanguageType>("javascript");

  const [code, setCode] = useState("// Write your code here...");
  const [theme, setTheme] = useState<string>("vs-dark");

  useEffect(() => {
    const templates = {
      javascript: "// JS Starter code",
      python: "# Python Starter",
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}",
      java: "public class Solution {\n  public static void main(String[] args) {}\n}",
      typescript: "// TypeScript Starter",
    };
    setCode(templates[language]);
  }, [language]);

  return (
    <div className="md:col-span-6 bg-white rounded-xl shadow-lg h-full flex flex-col border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageType)}
            className="px-2 py-1 text-sm border rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Language & Theme Select */}
        <div className="flex gap-3 items-center">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-2 py-1 text-sm border rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {themeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || "")}
          defaultValue={code}
          className="rounded-b-xl"
          options={{
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
    </div>
  );
}

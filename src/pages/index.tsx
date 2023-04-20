import { useState } from "react";
import type { Data } from "~/pages/api/stream";

function hasContent(
  data: Data
): data is Data & { choices: { delta: { content: string } }[] } {
  return "content" in data.choices[0].delta;
}

export default function Home() {
  const [isReading, setIsReading] = useState(false);
  const [responseText, setResponseText] = useState("");

  async function readStream() {
    const response = await fetch("/api/stream");
    if (response.body !== null) {
      setIsReading(true);
      setResponseText("");

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsReading(false);

          break;
        }
        const data: Data = JSON.parse(value);
        if (hasContent(data)) {
          setResponseText(
            (prev) => `${prev}${data.choices[0].delta.content || ""}`
          );
        }
      }
    }
  }

  return (
    <main className="container mx-auto max-w-md bg-stone-100 shadow-lg rounded p-4 flex flex-col gap-4">
      <button
        className="bg-fuchsia-700 text-stone-50 px-2 py-1 rounded disabled:opacity-50"
        onClick={readStream}
        disabled={isReading}
      >
        read stream
      </button>
      <div className="flex flex-col">
        <span
          className={`text-stone-50 px-2 self-start rounded-t ${
            isReading ? "bg-fuchsia-700" : "bg-stone-900"
          }`}
        >
          {isReading ? "Reading..." : "Not Reading"}
        </span>
        <pre className="bg-stone-900 py-2 px-4 overflow-auto text-stone-50">
          {responseText}
        </pre>
      </div>
    </main>
  );
}

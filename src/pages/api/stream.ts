import type { NextApiRequest, NextApiResponse } from "next";

export interface Data {
  choices: {
    delta:
      | {
          role: "assistant";
        }
      | {
          content: string;
        }
      | {};
    finish_reason: "stop" | null;
    index: number;
  }[];
  created: number;
  id: string;
  model: "gpt-3.5-turbo";
  object: "chat.completion.chunk";
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.write(
    JSON.stringify({
      choices: [
        {
          delta: {
            role: "assistant",
          },
          finish_reason: null,
          index: 0,
        },
      ],
      created: 1629200000,
      id: "1",
      model: "gpt-3.5-turbo",
      object: "chat.completion.chunk",
    })
  );

  // send a chunk of data every 1 second
  const interval = setInterval(() => {
    const data = `data: ${new Date().toISOString()}\n`;
    res.write(
      JSON.stringify({
        choices: [
          {
            delta: {
              content: data,
            },
            finish_reason: null,
            index: 0,
          },
        ],
        created: 1629200000,
        id: "1",
        model: "gpt-3.5-turbo",
        object: "chat.completion.chunk",
      })
    );
  }, 1000);

  // stop sending data after 5 seconds
  setTimeout(() => {
    clearInterval(interval);
    res.write(
      JSON.stringify({
        choices: [
          {
            delta: {},
            finish_reason: "stop",
            index: 0,
          },
        ],
        created: 1629200000,
        id: "1",
        model: "gpt-3.5-turbo",
        object: "chat.completion.chunk",
      })
    );
    res.end();
  }, 5000);
}

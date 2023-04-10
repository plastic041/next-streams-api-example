import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.write("Starting stream...\n");

  // send a chunk of data every 1 second
  const interval = setInterval(() => {
    const data = `data: ${new Date().toISOString()}\n`;
    res.write(data);
  }, 1000);

  // stop sending data after 5 seconds
  setTimeout(() => {
    clearInterval(interval);
    res.write("Stream ended.\n");
    res.end();
  }, 5000);
}

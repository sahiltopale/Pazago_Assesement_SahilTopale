export async function sendMessageToAgent(prompt, onChunk) {
  try {
    // Base URL from environment (works in prod + dev)
    const BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://api-dev.provue.ai";

    const response = await fetch(`${BASE_URL}/api/webapp/agent/test-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response stream available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        try {
          const json = JSON.parse(line.replace("data:", "").trim());
          if (json?.payload?.text) {
            onChunk(json.payload.text);
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

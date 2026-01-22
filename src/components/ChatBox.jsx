import { useEffect, useRef, useState } from "react";
import { sendMessageToAgent } from "../services/api";

function getTimeStamp() {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
}

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Ask me about the weather 🌤️",
      time: getTimeStamp(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const chatEndRef = useRef(null);

  // Apply theme
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, time: getTimeStamp() },
    ]);

    setLoading(true);
    let botText = "";
    const botIndex = messages.length + 1;

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "", time: getTimeStamp() },
    ]);

    try {
      await sendMessageToAgent(userText, (chunk) => {
        botText += chunk;
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === botIndex ? { ...msg, text: botText } : msg,
          ),
        );
      });
    } catch {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === botIndex
            ? {
                ...msg,
                text: "⚠️ Unable to fetch live weather right now.\nThis response is shown to demonstrate UI behavior.",
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        🌤️ Weather Assistant
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className="bubble">
              {msg.text.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
              <span className="timestamp">{msg.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="bubble typing">Typing…</div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any city's weather…"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

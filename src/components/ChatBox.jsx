import { useEffect, useRef, useState } from "react";
import { sendMessageToAgent } from "../services/api";

/* ---------- Date & Time Helper ---------- */
const getDateTime = () => {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Ask me about the weather 🌤️",
      time: getDateTime(),
      reactions: { up: 0, down: 0 },
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");

  const chatEndRef = useRef(null);

  /* ---------- Theme Toggle ---------- */
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* ---------- Auto Scroll ---------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Send Message ---------- */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input,
      time: getDateTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let botText = "";
    const botIndex = messages.length + 1;

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: "",
        time: getDateTime(),
        reactions: { up: 0, down: 0 },
      },
    ]);

    try {
      await sendMessageToAgent(input, (chunk) => {
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
            ? { ...msg, text: "⚠️ Failed to fetch weather data." }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Export Chat ---------- */
  const exportChat = () => {
    const data = messages
      .map((m) => `[${m.time}] ${m.role.toUpperCase()}: ${m.text}`)
      .join("\n\n");

    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "weather-chat-history.txt";
    a.click();
  };

  /* ---------- Reactions ---------- */
  const react = (index, type) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [type]: msg.reactions[type] + 1,
              },
            }
          : msg,
      ),
    );
  };

  /* ---------- Search Filter ---------- */
  const filteredMessages = messages.filter((m) =>
    m.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <div className="chat-header">
        <h3>🌤️ Weather Assistant</h3>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="header-actions">
          <input
            className="search-input"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="export-btn" onClick={exportChat}>
            Export
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {filteredMessages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className="bubble">
              {msg.text}
              <span className="time">{msg.time}</span>

              {msg.role === "bot" && (
                <div className="reactions">
                  <span onClick={() => react(i, "up")}>
                    👍 {msg.reactions.up}
                  </span>
                  <span onClick={() => react(i, "down")}>
                    👎 {msg.reactions.down}
                  </span>
                </div>
              )}
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

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any city's weather..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

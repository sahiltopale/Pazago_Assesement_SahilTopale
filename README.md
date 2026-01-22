🌦️ Weather Agent Chat App

A simple chat-based web application that allows users to ask weather-related questions and receive responses from a backend agent API.
This project was built as part of a technical assessment to demonstrate frontend development, API handling, and UI design skills.

🚀 Features

💬 Chat-style interface for user–assistant interaction

🌤️ Weather-focused assistant responses

🔄 Real-time message rendering

🧪 Graceful fallback response when API is unavailable

🎨 Clean and minimal UI

⌨️ Supports sending messages via Enter key

🛠️ Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS

API Communication: Fetch API

State Management: React Hooks

📂 Project Structure
src/
│── components/
│ ├── ChatWindow.jsx
│ └── ChatInput.jsx
│
│── App.jsx
│── main.jsx

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone <repository-url>
cd weather-chat

2️⃣ Install dependencies
npm install

3️⃣ Run the application
npm run dev

The app will be available at:

http://localhost:5173

🔌 API Integration

The application sends POST requests to the following endpoint:

/api/webapp/agent/test-agent

Request Body:
{
"prompt": "What's the weather in Mumbai?",
"stream": false
}

⚠️ API Availability Note (Important)

During development and testing, the API endpoint occasionally returned a 404 (Not Found) response.

To ensure uninterrupted user experience and proper UI demonstration:

A fallback demo response is displayed when the API request fails

This prevents UI breakage and allows smooth interaction flow

Error handling is intentionally user-friendly and non-blocking

Example fallback response:
🌤️ Demo Response: Mumbai is warm and humid today with a chance of light rain.

This approach ensures the frontend remains fully functional even when the backend service is unavailable.

🎯 Assumptions & Notes

The API endpoint is assumed to be provided and managed externally.

UI prioritizes clarity, usability, and assessment requirements.

Error handling focuses on maintaining UX rather than detailed debugging output.

Code structure is kept simple and readable for easy evaluation.

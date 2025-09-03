# Livio Acerbo AI Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-8E44AD?style=for-the-badge&logo=google&logoColor=white)

The Livio Acerbo AI Assistant is a sleek, modern, and feature-rich chat application designed to showcase the power and versatility of the Google Gemini API. It provides a user experience similar to popular messaging apps like Telegram, supporting both text and voice-based conversations in a responsive, customizable interface.

![Livio Acerbo AI Assistant Screenshot](https://storage.googleapis.com/aistudio-project-images/250902_gemini_messenger_preview.png)

---

## ✨ Features

- **Conversational AI:** Engage in natural, real-time conversations with the powerful `gemini-2.5-flash` model.
- **Text & Voice Input:** Send messages by typing or by simply holding down the microphone button to record your voice.
- **Voice Transcription:** Voice messages are automatically transcribed and sent to the AI for a relevant, contextual response.
- **Text-to-Speech (TTS):** AI responses generated from voice inputs can be read aloud, creating a hands-free conversational experience.
- **Customizable Interface:** A slide-in settings panel allows users to personalize their chat experience.
  - **Avatar Personalization:** Upload a custom avatar image to represent yourself.
  - **Themes:** Choose from multiple color themes to change the look of message bubbles.
  - **Backgrounds:** Select from a variety of chat backgrounds.
  - **User Profile:** Update personal details like name and contact information.
- **Persistent Settings:** All user preferences are saved locally, simulating a real-world application where settings are fetched from a database.
- **Modern UI/UX:**
  - Clean, responsive design that works beautifully on mobile and desktop screens.
  - Loading indicators for AI responses, initialization, and saving settings.
  - Smooth animations and a professional look and feel.
- **Secure & Deployable:** Includes a minimal backend server to securely manage the Gemini API key, making the application ready for cloud deployment on platforms like Cloud Run.
- **Robust Error Handling:** User-friendly error messages guide the user if something goes wrong, such as a failure to initialize the AI service.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/) (with Hooks)
- **Backend:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) (for API key management and serving static files)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI:** [Google Gemini API](https://ai.google.dev/) (`@google/genai` library)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Web APIs:**
  - **MediaStream / MediaRecorder API:** For capturing voice input.
  - **Web Speech API:** For text-to-speech functionality.
  - **FileReader API:** For handling local image uploads.

---

## 📂 Project Structure

The project is organized with a clear separation of concerns, making it easy to navigate and extend.

```
/
├── components/         # Reusable React components
│   ├── ...
├── hooks/              # Custom React hooks for stateful logic
│   ├── ...
├── services/           # Modules for interacting with external APIs or data
│   ├── geminiService.ts
│   ├── ttsService.ts
│   └── userService.ts
├── constants.ts
├── types.ts
├── App.tsx             # Main application component
├── index.html          # HTML entry point with Import Map
├── index.tsx           # React root renderer
├── server.mjs          # Node.js server for API key and static files
├── package.json        # Node.js project dependencies and scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
- A Google Gemini API key.
  - Get one at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Local Setup

1.  **Install Dependencies:** Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

2.  **Set API Key:** The application reads the API key from a server-side `API_KEY` environment variable. Set this variable in your terminal before starting the server.
    - **Linux/macOS:**
      ```bash
      export API_KEY="YOUR_GEMINI_API_KEY"
      ```
    - **Windows (Command Prompt):**
      ```bash
      set API_KEY="YOUR_GEMINI_API_KEY"
      ```
    - **Windows (PowerShell):**
      ```bash
      $env:API_KEY="YOUR_GEMINI_API_KEY"
      ```

3.  **Run the Server:**
    ```bash
    npm start
    ```
    - This will start the server on `http://localhost:8080`. Open this URL in your browser.

---

### ☁️ Deployment on Cloud Run

This application is structured for easy deployment on container-based services like Google Cloud Run.

1.  **Containerize:** Create a `Dockerfile` that installs dependencies (`npm install`) and defines the start command (`npm start`).
2.  **Configure Port:** The server listens on the port defined by the `PORT` environment variable, defaulting to `8080`. Cloud Run automatically provides a `PORT` variable, so the server will work without extra configuration.
3.  **Set Secret:** When deploying to Cloud Run, configure the `API_KEY` as a secret environment variable in your service configuration. The Node.js server will automatically pick it up and securely provide it to the frontend.

---

###  Architectural Notes

- **Secure API Key Handling:** To prevent exposing the Gemini API key in the browser, a simple Node.js/Express backend is included. Its sole responsibilities are to serve the static frontend files and provide the API key (read from a server-side environment variable) to the client via a secure API endpoint. This is a best practice for web applications using sensitive keys.
- **Decoupled Services:** The application logic is separated from the UI. Services like `geminiService.ts` and `userService.ts` handle all external communication. This makes the code easier to test and maintain.
- **Mock Backend:** The `userService.ts` simulates asynchronous API calls to a database using `localStorage` for persistence for user settings. This makes it straightforward to integrate a real backend in the future by simply updating the service file.

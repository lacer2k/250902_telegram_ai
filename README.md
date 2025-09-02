# Livio Acerbo AI Assistant

The Livio Acerbo AI Assistant is a sleek, modern, and feature-rich chat application designed to showcase the power and versatility of the Google Gemini API. It provides a user experience similar to popular messaging apps like Telegram, supporting both text and voice-based conversations in a responsive, customizable interface.

![Livio Acerbo AI Assistant Screenshot](https://storage.googleapis.com/aistudio-project-images/250902_gemini_messenger_preview.png)

---

## ✨ Features

- **Conversational AI:** Engage in natural, real-time conversations with the powerful `gemini-2.5-flash` model.
- **Text & Voice Input:** Send messages by typing or by simply holding down the microphone button to record your voice.
- **Voice Transcription:** Voice messages are automatically transcribed and sent to the AI for a relevant, contextual response.
- **Text-to-Speech (TTS):** AI responses generated from voice inputs can be read aloud, creating a hands-free conversational experience.
- **Customizable Interface:** A slide-in settings panel allows users to personalize their chat experience.
  - **Avatar Personalization:** Upload a custom avatar image to represent yourself. The avatar is displayed in the main chat header.
  - **Themes:** Choose from multiple color themes (Default, Forest, Sunset, Ocean) to change the look of message bubbles.
  - **Backgrounds:** Select from a variety of chat backgrounds.
  - **User Profile:** Update personal details like name and contact information.
- **Persistent Settings:** All user preferences are saved locally, simulating a real-world application where settings are fetched from a database.
- **Modern UI/UX:**
  - Clean, responsive design that works beautifully on mobile and desktop screens.
  - Loading indicators for AI responses and saving settings.
  - Smooth animations and a professional look and feel.
- **Robust Error Handling:** User-friendly error messages guide the user if something goes wrong, such as a failure to process a voice message.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/) (with Hooks)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI:** [Google Gemini API](https://ai.google.dev/) (`@google/genai` library)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Web APIs:**
  - **MediaStream / MediaRecorder API:** For capturing voice input.
  - **Web Speech API:** For text-to-speech functionality.
  - **FileReader API:** For handling local image uploads.
- **Runtime:** No build step required; the app runs directly in the browser using ES Modules and an Import Map.

---

## 📂 Project Structure

The project is organized with a clear separation of concerns, making it easy to navigate and extend.

```
/
├── components/         # Reusable React components
│   ├── ChatHeader.tsx
│   ├── ChatInput.tsx
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   ├── SettingsPanel.tsx
│   └── icons.tsx
├── hooks/              # Custom React hooks for stateful logic
│   ├── useSettings.ts
│   └── useVoiceRecorder.ts
├── services/           # Modules for interacting with external APIs or data
│   ├── geminiService.ts    # Handles communication with the Gemini API
│   ├── ttsService.ts       # Wrapper for the Web Speech (TTS) API
│   └── userService.ts      # Mock service for fetching/saving user data
├── constants.ts        # Shared constants (themes, backgrounds)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.html          # HTML entry point with Import Map
└── index.tsx           # React root renderer
```

---

## 🚀 Getting Started

### Prerequisites

You need a Google Gemini API key to run this application.
- Get an API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup

1.  **API Key:** The application is configured to read the API key from `process.env.API_KEY`. In your development environment, you would typically set this using a `.env` file or an environment variable.

2.  **Running Locally:** Since this project does not have a build step, you can run it with any simple static file server.
    - If you have Node.js, you can use a package like `serve`:
      ```bash
      # Install the server package globally
      npm install -g serve

      # Serve the project directory
      serve .
      ```
    - Open your browser to the URL provided by the server (e.g., `http://localhost:3000`).

### Architectural Notes

- **Decoupled Services:** The application logic is separated from the UI. Services like `geminiService.ts` and `userService.ts` handle all external communication. This makes the code easier to test and maintain.
- **Mock Backend:** The `userService.ts` simulates asynchronous API calls to a database using `localStorage` for persistence. This allows the frontend to be developed and tested independently and makes it straightforward to integrate a real backend in the future by simply updating the service file.
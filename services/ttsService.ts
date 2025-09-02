// A simple service to handle Text-to-Speech using the browser's Web Speech API.

let currentUtterance: SpeechSynthesisUtterance | null = null;
let onEndCallback: (() => void) | null = null;

const handleEnd = () => {
    if (onEndCallback) {
        onEndCallback();
    }
    currentUtterance = null;
    onEndCallback = null;
};

/**
 * Speaks the given text using the browser's speech synthesis.
 * Cancels any previously playing speech.
 * @param text The text to be spoken.
 * @param onEnd A callback function to execute when speech has finished.
 */
export const speak = (text: string, onEnd: () => void): void => {
    if (!window.speechSynthesis) {
        console.error("Browser does not support speech synthesis.");
        return;
    }

    // Cancel any ongoing speech before starting a new one.
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    onEndCallback = onEnd;

    utterance.onend = handleEnd;
    utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
        handleEnd(); // Treat error as end of playback
    };
    
    // Asynchronously select a preferred voice and start speaking.
    const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prefer a high-quality Google voice if available.
        let selectedVoice = voices.find(voice => voice.name === 'Google US English');
        if (!selectedVoice) {
            // Fallback to the first available English voice.
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        window.speechSynthesis.speak(utterance);
    };

    // The voices list may load asynchronously, so we handle both cases.
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
        setVoiceAndSpeak();
    }
};

/**
 * Stops the currently speaking utterance.
 */
export const cancel = (): void => {
    if (window.speechSynthesis && currentUtterance) {
        window.speechSynthesis.cancel();
    }
};

import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderProps {
  onRecordingComplete: (audioUrl: string, mimeType: string) => void;
}

export const useVoiceRecorder = ({ onRecordingComplete }: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const mimeTypeRef = useRef<string>('');

  const startTimer = () => {
    setRecordingSeconds(0);
    // Fix: Explicitly use `window.setInterval` to ensure the return type is a number, resolving conflict with Node.js's `Timeout` type.
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      // Fix: Use `window.clearInterval` to match the use of `window.setInterval`.
      window.clearInterval(timerIntervalRef.current);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeTypes = [
        'audio/webm; codecs=opus',
        'audio/ogg; codecs=opus',
        'audio/webm',
        'audio/ogg',
      ];
      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));

      if (!supportedMimeType) {
        console.error('No supported audio MIME type found for MediaRecorder');
        alert("Your browser doesn't support the required audio recording formats.");
        return;
      }
      
      mimeTypeRef.current = supportedMimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
        const audioUrl = URL.createObjectURL(audioBlob);
        onRecordingComplete(audioUrl, mimeTypeRef.current);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error('Failed to start recording', err);
      alert("Microphone access was denied. Please allow microphone access in your browser settings.");
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  }, []);

  return { isRecording, startRecording, stopRecording, recordingSeconds };
};

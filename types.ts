export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  sender: Sender;
  text?: string;
  audioUrl?: string;
  timestamp: string;
  isSpoken?: boolean;
}

export interface Theme {
  name: string;
  userBubbleClass: string;
  aiBubbleClass: string;
}

export interface Settings {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  backgroundUrl: string;
  theme: string; // The name of the theme, e.g., "Default"
}

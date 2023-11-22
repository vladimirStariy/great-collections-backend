export interface User {
    userId: string;
    userName: string;
}
  
export interface Message {
    user: User;
    timeSent: string;
    text: string;
}
  
  // Interface for when server emits events to clients.
export interface ServerToClientEvents {
    comment: (e: Message) => void;
}
  
  // Interface for when clients emit events to the server.
export interface ClientToServerEvents {
    comment: (e: Message) => void;
}
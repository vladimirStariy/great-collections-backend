export interface User {
    userId: string;
    userName: string;
}
  
export interface Message {
    user: User;
    timeSent: string;
    text: string;
}
  
export interface ServerToClientEvents {
    comment: (e: Message) => void;
}

export interface ClientToServerEvents {
    comment: (e: Message) => void;
}
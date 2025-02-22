import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const useSocket = create<{
  socket: Socket | null;
  createSocketConnection: () => void;
  deleteSocketConnection: () => void;
  getSocketValue: () => Socket | null;
}>((set, get) => ({
  socket: null,

  createSocketConnection: () => {
    if (!get().socket) {
      const server: Socket = io(SOCKET_SERVER_URL);
      set(() => ({ socket: server })); // Function inside set prevents unnecessary re-renders
    }
  },

  deleteSocketConnection: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set(() => ({ socket: null })); // Function inside set prevents unnecessary re-renders
    }
  },
  getSocketValue: () => get().socket,
}));

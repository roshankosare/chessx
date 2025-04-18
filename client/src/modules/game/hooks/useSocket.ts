import { getServerUrl } from "@/lib/utils";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const SOCKET_SERVER_URL = getServerUrl();

export const useSocket = create<{
  socket: Socket | null;
  createSocketConnection: () => void;
  reconnect: (socketId: string, roomId: string) => void;
  deleteSocketConnection: () => void;
  getSocketValue: () => Socket | null;
  setSocketValue: (socket: Socket) => void;
}>((set, get) => ({
  socket: null,

  createSocketConnection: () => {
    if (!get().socket) {
      const server: Socket = io(SOCKET_SERVER_URL);
      set(() => ({ socket: server })); // Function inside set prevents unnecessary re-renders
    }
  },
  reconnect: (socketId: string, roomId: string) => {
    if (!get().socket) {
      const server: Socket = io(SOCKET_SERVER_URL, {
        auth: { socketId: socketId, roomId: roomId }, // Send the stored socketId
        reconnection: true, // Enable auto-reconnection
      });
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
  setSocketValue: (socket: Socket) =>
    set({
      socket: socket,
    }),
}));

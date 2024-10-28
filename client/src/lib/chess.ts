import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";
export const createSocketConnection = (): Socket | null => {
  const newSocket = io(SOCKET_SERVER_URL);
  if (newSocket) {
    return newSocket;
  }
  return null;
};

export const deleteSocketConnection = (socket: Socket) => {
  return () => {
    socket.disconnect(); // Always disconnect the socket to clean up resources
  };
};



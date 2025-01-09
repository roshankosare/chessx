import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // crete socket io connection for
  const createSocketConnectionRef = useRef(() => {
    const server: Socket = io(SOCKET_SERVER_URL);
    if (server) {
      setSocket(server);
    }
  });

  const deleteSocketConnectionRef = useRef(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  });

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket]);

  return {
    socket,
    createSocketConnection:createSocketConnectionRef.current,
    deleteSocketConnection:deleteSocketConnectionRef.current,
  };
};

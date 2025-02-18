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


export const getPieceImage = (value: string): string => {
  const pieceBaseUrl = "/assets/";
  switch (value) {
    case "wp":
      return pieceBaseUrl + "wp.svg";

    case "bp":
      return pieceBaseUrl + "bp.svg";

    case "wb":
      return pieceBaseUrl + "wb.svg";

    case "bb":
      return pieceBaseUrl + "bb.svg";

    case "wn":
      return pieceBaseUrl + "wn.svg";

    case "bn":
      return pieceBaseUrl + "bn.svg";

    case "wr":
      return pieceBaseUrl + "wr.svg";

    case "br":
      return pieceBaseUrl + "br.svg";

    case "wq":
      return pieceBaseUrl + "wq.svg";

    case "bq":
      return pieceBaseUrl + "bq.svg";

    case "wk":
      return pieceBaseUrl + "wk.svg";

    case "bk":
      return pieceBaseUrl + "bk.svg";
  }

  return "";
};

export const sortPiecesByPower = (pieces: string[]): string[] => {
  const powerRanking: { [key: string]: number } = { 
    'p': 1, 
    'n': 2, 
    'b': 3, 
    'r': 4, 
    'q': 5, 
    'k': 6 
  };

  return pieces.sort((a, b) => powerRanking[a] - powerRanking[b]);
};



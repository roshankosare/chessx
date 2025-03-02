const STOCKFISH_HOST = process.env.STOCKFISH_HOST ?? 'localhost';
const STOCKFISH_PORT = process.env.STOCKFISH_PORT ?? '5123';

export const stockfishUrl = `http://${STOCKFISH_HOST}:${STOCKFISH_PORT}`;

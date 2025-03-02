const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const os = require("os");
// require("dotenv").config();

const app = express();
app.use(bodyParser.json());



function runStockfish(commands) {
    return new Promise((resolve, reject) => {
        try {
            const isWindows = os.platform() === "win32";
            const stockfishPath = isWindows ? "stockfish.exe" : "/usr/games/stockfish";
            const stockfish = spawn(stockfishPath, [], { shell: isWindows });

            let output = "";
            let isReady = false;

            stockfish.stdout.on("data", (data) => {
                const text = data.toString();
                output += text;

                // console.log(text); // Debugging: Log Stockfish output

                if (text.includes("readyok")) {
                    isReady = true;
                }

                if (text.includes("bestmove")) {
                    stockfish.stdin.write("quit\n");
                }
            });

            stockfish.on("close", () => resolve(output));
            stockfish.on("error", (err) => reject(err));

            // Send commands sequentially
            (async () => {
                for (const cmd of commands) {
                    stockfish.stdin.write(cmd + "\n");

                    if (cmd === "isready") {
                        while (!isReady) {
                            await new Promise((res) => setTimeout(res, 100)); // Wait for "readyok"
                        }
                    }
                }
            })();
        } catch (error) {
            reject(error);
        }
    });
}




app.get("/bestmove", async (req, res) => {
    const { fen = "startpos", depth = 10 } = req.body;


    if (!fen) return res.status(400).json({ error: "FEN is required" });


    // Stockfish command to get the best move
    const commands = [
        "uci",
        "isready",
        "setoption name Skill Level value 20",
        "setoption name MultiPV value 2",
        "setoption name Ponder value false",
        "ucinewgame",
        `position fen ${fen}`,
        `go depth ${depth}` // Use time instead of depth
    ];


    try {

        const result = await runStockfish(commands);
        const bestMove = parseBestMove(result);
        res.json({ bestMove });
    } catch (error) {
        res.status(500).json({ error: "Stockfish execution failed", details: error.message });
    }
});

// Function to parse the best move from Stockfish output
function parseBestMove(output) {
    const bestMoveLine = output.split("\n").find((line) => line.startsWith("bestmove"));
    return bestMoveLine ? bestMoveLine.split(" ")[1] : "No move found";
}

// Use HOST from .env or default to 0.0.0.0
const PORT = process.env.PORT || 5123;
app.listen(PORT, '0.0.0.0', () => console.log(`Stockfish API running on port ${PORT}`));


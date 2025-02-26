const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
app.use(bodyParser.json());

function runStockfish(command) {
    return new Promise((resolve, reject) => {

        try {
            const stockfish = spawn("stockfish", { shell: true });

            let output = "";
            stockfish.stdout.on("data", (data) => {
                output += data.toString();
                if (output.includes("bestmove")) {
                    stockfish.stdin.write("quit\n");  // Quit after getting the best move
                }
            });

            stockfish.on("close", () => resolve(output));
            stockfish.on("error", (err) => reject(err));

            stockfish.stdin.write(command + "\n");
            stockfish.stdin.end();
        } catch (error) {
            reject(error);
        }
    });
}

app.get("/bestmove", async (req, res) => {
    const { fen = "startpos", depth = 15 } = req.body;

    if (!fen) return res.status(400).json({ error: "FEN is required" });

    // Stockfish command to get the best move
    const command = `position fen ${fen}\ngo depth ${depth}`;


    try {

        const result = await runStockfish(command);
        // console.log(result);
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

const PORT = process.env.PORT || 5123;
app.listen(PORT, () => console.log(`Stockfish API running on port ${PORT}`));

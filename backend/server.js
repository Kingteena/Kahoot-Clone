import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'client' directory
app.use(express.static(join(__dirname, 'client')));


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./client/index.html"));
    }
);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("answer", (answer) => {
        console.log(`answer: ${answer}`);
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
  });
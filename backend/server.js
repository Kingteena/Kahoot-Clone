import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // Built-in body parsing in modern Express

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace this with the frontend's URL
    methods: ["GET", "POST"],
  },
});

const quiz = [
  {
    text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    correctAnswer: 0,
  },
  {
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
];

let rooms = {}; // Store room data
let ROOM_ID;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId, userID, username) => {
    if (!rooms[ROOM_ID]) {
      ROOM_ID = roomId;
      rooms[ROOM_ID] = { players: [], host: null, questionIndex: -1 };
    }

    // Assign host if it's the first connection in the room
    if (!rooms[ROOM_ID].host) {
      rooms[ROOM_ID].host = socket.id;
      io.to(socket.id).emit("role", true);
    } else {
      rooms[ROOM_ID].players.push({
        socketID: socket.id,
        userID: userID,
        username: username,
        answered: false,
        score: 0,
      });

      io.to(socket.id).emit("role", false);
    }

    socket.join(ROOM_ID);
  });

  socket.on("request-question", () => {
    console.log("Requesting question");
    if (rooms[ROOM_ID]?.host !== socket.id) return; // Only the host can control the quiz

    // Reset player states
    Object.values(rooms[ROOM_ID].players).forEach((p) => (p.answered = false));

    const questionIndex = ++rooms[ROOM_ID].questionIndex;

    if (questionIndex >= quiz.length) {
      socket.emit("quiz-complete");
    } else {
      io.to(ROOM_ID).emit("new-question", quiz[questionIndex]);
    }
  });

  socket.on("submit-answer", (answer) => {
    const player = rooms[ROOM_ID]["players"].find(
      (player) => player.socketID === socket.id
    );
    if (!player) {
      console.error("Player not found");
      return;
    }

    if (player.answered) {
      console.warn("Player already tried to answer!");
      return;
    }
    const question = quiz[rooms[ROOM_ID].questionIndex];
    const isCorrect = question.correctAnswer === answer;

    player.answered = true;
    if (isCorrect) player.score++;

    const allAnswered = Object.values(rooms[ROOM_ID]["players"]).every(
      (p) => p.answered
    );

    if (allAnswered) {
      // Send the correct answer to all players
      io.to(ROOM_ID).emit(
        "correct-answer",
        question.correctAnswer,
        rooms[ROOM_ID].players
      );
    }
  });

  socket.on("request-scores", () => {
    if (rooms[ROOM_ID]?.host !== socket.id) return; // Only the host can control the quiz

    const players = rooms[ROOM_ID].players;

    let isQuizComplete = false;

    if (rooms[ROOM_ID].questionIndex + 1 >= quiz.length) {
      isQuizComplete = true;
    }

    // Give all the players their score

    for (let i = 0; i < players.length; i++) {
      const playerId = players[i].socketID;
      const score = players[i].score;

      io.to(playerId).emit("score", score, isQuizComplete);
    }

    //give the host all the players scores
    socket.emit("score", rooms[ROOM_ID].players, isQuizComplete);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Routes
app.get("/", (req, res) => res.send("Server is running!"));

// Start the server
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);

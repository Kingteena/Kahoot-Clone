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


// app.get("/api/quiz/:id", (req, res) => {
//   const quiz = questions.find((q) => q.id === parseInt(req.params.id));
//   if (quiz) res.json(quiz);
//   else res.status(404).send("Quiz not found");
// });

const quizzes = [
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


io.on("connection", (socket) => {
  console.log("A user connected");

  let score = 0;

  
  socket.on("request-question", (questionIndex) => {
    if (questionIndex >= quizzes.length) {
      socket.emit("quiz-complete", score);
      return;
    }
    const newQuestion = quizzes[questionIndex];
    socket.emit("new-question", newQuestion);
  });

  socket.on("submit-answer", (data) => {
    console.log("Answer submitted:", data);
   const question = quizzes[data.question_number];
    if (data.answer === question.correctAnswer) {
      socket.emit("correct-answer", question.correctAnswer, true);
      score++;
    } else {
      socket.emit("correct-answer", question.correctAnswer, false);
    }
    
  }); 

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// app.get("/api/quiz/", (req, res) => {
//   res.json(quizzes);
// });

// Routes
app.get("/", (req, res) => res.send("Server is running!"));

// Start the server
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);

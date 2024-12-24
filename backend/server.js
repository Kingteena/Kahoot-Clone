import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json()); // Built-in body parsing in modern Express

// const questions = [
//
// ];

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

app.get("/api/quiz/", (req, res) => {
  res.json(quizzes);
});

// Routes
app.get("/", (req, res) => res.send("Server is running!"));

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { AnswerContainer } from "./components/AnswerContainer";
import { Question } from "./components/Question";
import { PostQuestionScreen } from "./components/PostQuestionScreen";
import { Leaderboard } from "./components/Leaderboard";

const socket = io("http://localhost:3000");

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join-room", "room1");
      console.log("Joining");
    });

    socket.on("new-question", (question) => {
      setCorrectAnswerIndex(null);
      setCurrentQuestion(question);
      setCorrectAnswerIndex(null);
      setAnswerSubmitted(false);
      setIsLeaderboardVisible(false);
    });

    socket.on("correct-answer", (correctAnswer, players) => {
      setCorrectAnswerIndex(correctAnswer);
    });

    socket.on("quiz-complete", () => {
      setIsQuizComplete(true);
      socket.emit("request-scores");
    });

    socket.on("score", (scores, isQuizComplete) => {
      setScore(scores);
      setIsQuizComplete(isQuizComplete);
      setIsLeaderboardVisible(true);
    });

    socket.on("role", (role) => {
      console.log(role);
      setIsHost(role);
    });

    return () => {
      socket.off("connect");
      socket.off("new-question");
      socket.off("correct-answer");
      socket.off("quiz-complete");
      socket.off("role");
    };
  }, []);

  const handleAnswerSelect = (answer) => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true);
      socket.emit("submit-answer", answer);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  } else if (isLeaderboardVisible) {
    return (
      <div className="quiz-container">
        {isQuizComplete && <h2>Quiz Complete!</h2>}
        {isHost ? (
          <>
            <Leaderboard scores={score} />
            {!isQuizComplete && (
              <button
                className="next-button button"
                onClick={() => {
                  socket.emit("request-question");
                  console.log("Requesting question");
                }}
              >
                Next Question
              </button>
            )}
          </>
        ) : (
          <p>Your score: {score}</p>
        )}
      </div>
    );
  } else if (answerSubmitted && correctAnswerIndex == null) {
    return <PostQuestionScreen />;
  } else if (!currentQuestion) {
    return (
      <div>
        Loading...
        {isHost && (
          <button
            onClick={() => {
              socket.emit("request-question");
            }}
          >
            Start Quiz
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className="quiz-container">
        {isHost && <h2>You Are the Host!</h2>}

        <Question question_text={currentQuestion.text} />
        <AnswerContainer
          options={currentQuestion.options}
          onAnswerSelect={handleAnswerSelect}
          correctAnswerIndex={correctAnswerIndex}
          isHost={isHost}
        />

        {isHost && (
          <button
            className={
              correctAnswerIndex !== null
                ? "next-button button"
                : "next-button button hidden"
            }
            onClick={() => {
              socket.emit("request-scores");
            }}
          >
            Next
          </button>
        )}
      </div>
    );
  }
}

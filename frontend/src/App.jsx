import { use } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {AnswerContainer} from "./components/AnswerContainer";
import { Question } from "./components/Question";

let socket;


function QuizContainer() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [isHost, setIsHost] = useState(false);

  if (!socket) {
    socket = io("http://localhost:3000");
  }

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
    });

    socket.on("correct-answer", (correctAnswer, players) => {
      setCorrectAnswerIndex(correctAnswer);
    });

    socket.on("quiz-complete", (scores) => {
      setIsQuizComplete(true);
      setScore(scores);
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
    if (correctAnswerIndex === null) {
      socket.emit("submit-answer", answer);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  } else if (isQuizComplete) {
    return (
      <div className="quiz-container">
        <h2>Quiz Complete!</h2>
        {isHost ? (
          score.map((player) => (
            <p>
              {player.socketID} : {player.score}
            </p>
          ))
        ) : (
          <p>Your score: {score}</p>
        )}
      </div>
    );
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
              socket.emit("request-question");
            }}
          >
            Next Question
          </button>
        )}
      </div>
    );
  }
}


export default QuizContainer;

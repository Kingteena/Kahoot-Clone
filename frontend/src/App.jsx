import { use } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

function AnswerButton({ btn_color, btn_value, onClick }) {
  return (
    <button
      className="answer-button button"
      style={{ backgroundColor: btn_color }}
      onClick={onClick}
    >
      {btn_value}
    </button>
  );
}

function Answers({ options, onAnswerSelect, correctAnswerIndex, isHost }) {
  const colors = ["#d32f2f", "#388e3c", "#1976d2", "#fbc02d"];

  return (
    <div className="answer-container">
      {options.map((text, index) => (
        <AnswerButton
          key={index}
          btn_color={
            correctAnswerIndex !== null
              ? index === correctAnswerIndex
                ? "#00ff7f"
                : "#b22222"
              : colors[index]
          }
          btn_value={text}
          onClick={isHost ? undefined : () => onAnswerSelect(index)}
        />
      ))}
    </div>
  );
}

function QuizContainer() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
    //when socket connects to host console.log it

    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join-room", "room1");
      console.log("JOining");
    });

    socket.on("new-question", (question) => {
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

  // This effect will run whenever the currentQuestionIndex changes
  useEffect(() => {
    socket.emit("request-question", currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer) => {
    if (correctAnswerIndex === null) {
      socket.emit("submit-answer", answer);
    }
  };

  function handleNextQuestion() {
    setCurrentQuestionIndex((prev) => prev + 1);
    setCorrectAnswerIndex(null);
  }


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
            Start Quiz{" "}
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className="quiz-container">
        {isHost && <h2>You Are the Host!</h2>}

        <Question question_text={currentQuestion.text} />
        <Answers
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
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        )}
      </div>
    );
  }
}
function Question({ question_text }) {
  return <h2 className="question-text">{question_text}</h2>;
}

export default QuizContainer;

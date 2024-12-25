import { use } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

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

function Answers({ options, onAnswerSelect, correctAnswerIndex }) {
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
          onClick={() => onAnswerSelect(index)}
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

  useEffect(() => {
    socket.emit("request-question", currentQuestionIndex);

    socket.on("new-question", (question) => {
      setCurrentQuestion(question);
      setCorrectAnswerIndex(null);
    });

    socket.on("correct-answer", (correctAnswer, correct) => {
      setCorrectAnswerIndex(correctAnswer);
    });

    socket.on("quiz-complete", (score) => {
      setIsQuizComplete(true);
      setScore(score);
    });

    return () => {
      socket.off("new-question");
      socket.off("correct-answer");
      socket.off("quiz-complete");
    };
  }, []);

  // This effect will run whenever the currentQuestionIndex changes
  useEffect(() => { 
    socket.emit("request-question", currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer) => {
    if (correctAnswerIndex === null) {
      socket.emit("submit-answer", {
        answer: answer,
        question_number: currentQuestionIndex,
      });
    }
  };

  function handleNextQuestion() {
    setCurrentQuestionIndex((prev) => prev + 1)
    setCorrectAnswerIndex(null);
  }

  if (isQuizComplete) {
    return (
      <div className="quiz-container">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score}</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  } else if (!currentQuestion) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="quiz-container">
        <Question question_text={currentQuestion.text} />
        <Answers
          options={currentQuestion.options}
          onAnswerSelect={handleAnswerSelect}
          correctAnswerIndex={correctAnswerIndex}
        />
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
      </div>
    );
  }
}
function Question({ question_text }) {
  return <h2 className="question-text">{question_text}</h2>;
}

export default QuizContainer;

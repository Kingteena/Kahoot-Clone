import React from "react";

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

function Answers({ options, onAnswerSelect, correct_answer }) {
  const colors = ["#d32f2f", "#388e3c", "#1976d2", "#fbc02d"];

  let isFeedbackTime = false;

  if (correct_answer != undefined) {
    isFeedbackTime = true;
  }

  return (
    <div className="answer-container">
      {options.map((text, index) => (
        <AnswerButton
          key={index}
          btn_color={
            isFeedbackTime
              ? index === correct_answer
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isQuizComplete, setIsQuizComplete] = React.useState(false);
  const [isFeedbackTime, setIsFeedbackTime] = React.useState(false);
  const [questions, setQuestions] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:3000/api/quiz/')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);


  const handleAnswerSelect = (answer) => {
    setIsFeedbackTime(true);
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  if (isQuizComplete) {
    return (
      <div className="quiz-container">
        <h2>Quiz Complete!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
      </div>
    );
  }

  function handleNextQuestion() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizComplete(true); // End the quiz if no more questions
    }
    setIsFeedbackTime(false);
  }


  if (!questions) {
    return <div>Loading...</div>;
  }
  else{
    const current_question = questions[currentQuestionIndex];

  return (
    
    <div className="quiz-container">
      <Question question_text={current_question.text} />
      <Answers
        options={current_question.options}
        onAnswerSelect={handleAnswerSelect}
        correct_answer={
          isFeedbackTime ? current_question.correctAnswer : undefined
        }
      />
      <button
        className={
          isFeedbackTime ? "next-button button" : "next-button button hidden"
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

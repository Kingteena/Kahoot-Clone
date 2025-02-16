import { writeToFirestore } from "../helpers/FirestoreController";
import { useState, useEffect, useContext } from "react";

import { AnswerContainer } from "../components/AnswerContainer";
import { AuthContext } from "../helpers/AuthContext";

export default function CreateQuiz() {
  const [quiz, setQuiz] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isQuestion, setIsQuestion] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);

  const { user, loading } = useContext(AuthContext);

  function changeQuestion(isIncrement) {
    // Save data
    setQuiz((previousQuiz) => {
      previousQuiz[questionNumber - 1] = {
        text: questionText,
        options: answers,
        isQuestion: isQuestion,
      };
      return previousQuiz;
    });

    // Change question number
    const change = isIncrement ? 1 : -1;
    setQuestionNumber((previous) => {
      const newQuestionNumber = previous + change;
      if (newQuestionNumber > 0) {
        return newQuestionNumber;
      } else {
        return previous;
      }
    });
  }

  useEffect(() => {
    // Load old data
    if (
      quiz[questionNumber - 1] != undefined &&
      quiz[questionNumber - 1] != null
    ) {
      const currentQuestion = quiz[questionNumber - 1];
      setQuestionText(currentQuestion.text);
      setAnswers(currentQuestion.options);
      setIsQuestion(currentQuestion.isQuestion);
    } else {
      setQuestionText("");
      setAnswers(["", "", "", ""]);
      setIsQuestion(false);
    }
  }, [questionNumber, quiz]);

  function submitQuestions() {
    // Save data
    setQuiz((previousQuiz) => {
      previousQuiz[questionNumber - 1] = {
        text: questionText,
        options: answers,
        isQuestion: isQuestion,
      };
      return previousQuiz;
    });

    //get user id, make sure user is logged in

    if (loading || !user) {
      console.error("User not logged in");
      return;
    }
    writeToFirestore("quizzes", user.uid, { quiz: quiz });
  }

  return (
    <div className="quiz-container">
      <h2>Question {questionNumber}</h2>
      <br />
      <input
        className="question-text"
        type="text"
        placeholder="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      {isQuestion && (
        <AnswerContainer
          options={answers}
          isPlayable={false}
          editable={true}
          onChangeAnswer={(e, index) =>
            setAnswers((previous) => [
              // replace changed value
              ...previous.slice(0, index),
              e.target.value,
              ...previous.slice(index + 1),
            ])
          }
        />
      )}
      <div>
        <button
          className="button next-button"
          onClick={() => changeQuestion(false)}
        >
          Previous Question
        </button>
        <button
          style={{ backgroundColor: isQuestion ? "#00ff7f" : "#b22222" }}
          className="toggle-button button"
          onClick={() => {
            setIsQuestion((previous) => !previous);
          }} // toggle isQuestion
        >
          Change to {isQuestion ? "Slide" : "Question"}
        </button>
        <button
          className="button next-button"
          onClick={() => changeQuestion(true)}
        >
          Next Question
        </button>
      </div>
      <button className="button next-button" onClick={submitQuestions}>
        Submit
      </button>
    </div>
  );
}

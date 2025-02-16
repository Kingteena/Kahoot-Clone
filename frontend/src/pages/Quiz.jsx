import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { AnswerContainer } from "../components/AnswerContainer";
import { Question } from "../components/Question";
import { PostQuestionScreen } from "../components/PostQuestionScreen";
import { Leaderboard } from "../components/Leaderboard";

import { AuthContext } from "../helpers/AuthContext";
import { getFirestoreDocumentData } from "../helpers/FirestoreController";

const socket = io("http://localhost:3000");

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const { user, loadingUserData } = useContext(AuthContext);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      while (loadingUserData) {
        console.log("Waiting for user data");
        setTimeout(() => {}, 100);
      }
      console.log(user, user.uid, user.displayName);
      socket.emit("join-room", "room1", user.uid, user.displayName);
      console.log("Joining room");
    });

    socket.on("new-question", (question) => {
      setCorrectAnswerIndex(null);
      setCurrentQuestion(question);
      setCorrectAnswerIndex(null);
      setAnswerSubmitted(false);
      setIsLeaderboardVisible(false);
    });

    socket.on("correct-answer", (correctAnswer) => {
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
      s;
      // If the user is the host, get the quiz from Firestore
      if (role) {
        getFirestoreDocumentData("quizzes", user.uid)
          .then((data) => {
            console.log(data);
            socket.emit("set-quiz", data.quiz);
          })
          .catch((e) => {
            console.error("Error fetching quiz: ", e);
            setError("Error fetching quiz: " + e);
          });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("new-question");
      socket.off("correct-answer");
      socket.off("quiz-complete");
      socket.off("role");
    };
  }, [user, loadingUserData]);

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
          isPlayable={!isHost}
          editable={false}
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

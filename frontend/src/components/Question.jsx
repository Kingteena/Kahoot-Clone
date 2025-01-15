export function Question({ question_text, image }) {
  return (
    <>
      <h2 className="question-text">{question_text}</h2>
      {image && <img src={image} alt="question" />}
    </>
  );
}

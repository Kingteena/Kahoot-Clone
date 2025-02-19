export function Question({ question_text, image }) {
  return (
    <div className="bg-stone-300 m-8  rounded-lg border-stone-500 border-3">
      <h2 className="p-5">{question_text}</h2>
      {image && <img src={image} alt="question" />}
    </div>
  );
}

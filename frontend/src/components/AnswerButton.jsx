export function AnswerButton({ btn_color, btn_value, onClick }) {
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


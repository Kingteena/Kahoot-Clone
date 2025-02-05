export function AnswerButton({
  btn_color,
  btn_value,
  onClick,
  editable,
  onChange,
  placeholder,
}) {
  return (
    <div>
      {editable ? (
        <input
          className="button answer-button"
          type="text"
          placeholder={placeholder}
          onChange={onChange}
          style={{ backgroundColor: btn_color }}
          value={btn_value}
        />
      ) : (
        <button
          className="button answer-button playable-answer-button"
          style={{ backgroundColor: btn_color }}
          onClick={onClick}
        >
          {btn_value}
        </button>
      )}
    </div>
  );
}

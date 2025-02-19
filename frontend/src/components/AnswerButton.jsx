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
          className="rounded-lg p-4 text-white w-full h-fit shadow-md"
          type="text"
          placeholder={placeholder}
          onChange={onChange}
          style={{ backgroundColor: btn_color }}
          value={btn_value}
        />
      ) : (
        <button
          className="rounded-lg p-4 text-white w-full h-fit shadow-md hover:shadow-lg hover:scale-102 cursor-pointer"
          style={{ backgroundColor: btn_color }}
          onClick={onClick}
        >
          {btn_value}
        </button>
      )}
    </div>
  );
}

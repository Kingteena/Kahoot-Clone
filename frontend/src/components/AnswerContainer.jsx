import { AnswerButton } from "./AnswerButton";

export function AnswerContainer({
  options,
  onAnswerSelect,
  correctAnswerIndex,
  isPlayable,
  editable,
  onChangeAnswer,
}) {
  const colors = ["#d32f2f", "#388e3c", "#1976d2", "#fbc02d"];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
      {options.map((text, index) => (
        <AnswerButton
          key={index}
          btn_color={
            correctAnswerIndex !== null && correctAnswerIndex !== undefined
              ? index === correctAnswerIndex
                ? "#00ff7f"
                : "#b22222"
              : colors[index]
          }
          btn_value={text}
          onClick={isPlayable ? () => onAnswerSelect(index) : undefined}
          onChange={(e) => onChangeAnswer(e, index)}
          placeholder={`Answer ${index}`}
          editable={editable}
        />
      ))}
    </div>
  );
}

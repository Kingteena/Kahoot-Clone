import { AnswerButton } from "./AnswerButton";

export function AnswerContainer({
  options,
  onAnswerSelect,
  correctAnswerIndex,
  isHost,
}) {
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
          onClick={isHost ? undefined : () => onAnswerSelect(index)}
        />
      ))}
    </div>
  );
}

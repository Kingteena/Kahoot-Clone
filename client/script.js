const socket = io();

const answerButtons = document.querySelectorAll(".answer");

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    socket.emit("answer", button.id);
  });
});

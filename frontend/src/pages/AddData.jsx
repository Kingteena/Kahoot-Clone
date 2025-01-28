import { writeToFirestore } from "../helpers/FirestoreController";

export default function AddData() {
  return (
    <button
      onClick={() => {
        writeToFirestore("users", {
          first: "Alan",
          middle: "Mathison",
          last: "Turing",
          born: 1912,
        });
      }}
    >
      PRESS ME
    </button>
  );
}

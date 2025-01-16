import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome to the homepage</h2>
      <Link to="/quiz">Start Quiz</Link>
      <Link to="/login">Login or Sign Up</Link>
    </div>
  );
}

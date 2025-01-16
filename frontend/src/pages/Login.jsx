import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../helpers/FirebaseController";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successfulAction, setSuccessfulAction] = useState(null);
  const [username, setUsername] = useState("");

  const handleSignUp = (event) => {
    event.preventDefault();
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          setSuccessfulAction("User created successfully");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        console.error(errorCode, errorMessage);
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setSuccessfulAction("User logged in successfully");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  if (successfulAction) {
    return (
      <div>
        {successfulAction}
        <br />
        <Link to="/">Go To Home Page</Link>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Sign up</h1>
        <form onSubmit={handleSignUp}>
          <label>
            Username:
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <input type="submit" value="Sign Up" />
        </form>
        <br />
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <label>
              Email:
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <input type="submit" value="Log In" />
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }
}

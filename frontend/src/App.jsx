import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./helpers/AuthContext";
import { PrivateRoute } from "./helpers/PrivateRoute";

import Quiz from "./pages/Quiz";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";

export default function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="quiz" element={<PrivateRoute element={<Quiz />} />} />
            <Route
              path="create"
              element={<PrivateRoute element={<CreateQuiz />} />}
            />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }
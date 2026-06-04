import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Register />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
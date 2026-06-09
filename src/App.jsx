import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";

import MyScore from "./pages/MyScore";

import Login from "./pages/Login";

import ProtectedRoute
from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />


      <Routes>
        <Route path="/" element={<Register />} />

        
      <Route
  path="/login"
  element={<Login />}
/>

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
  path="/score"
  element={<MyScore />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
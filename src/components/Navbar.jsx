import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">Register</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/leaderboard">Leaderboard</Link>
    </nav>
  );
}

export default Navbar;
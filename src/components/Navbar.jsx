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
      {
  localStorage.getItem(
    "adminToken"
  ) && (
    <Link to="/dashboard">
      Dashboard
    </Link>
  )
}
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/score">
  My Score
</Link>
    </nav>
  );
}

export default Navbar;
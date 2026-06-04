import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/riderService";

function Leaderboard() {
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    const { data, error } = await getLeaderboard();

    if (error) {
      console.error(error);
      return;
    }

    setRiders(data);
  }

  return (
    <div>
      <h1>🏆 Leaderboard</h1>

      {riders.map((rider, index) => (
        <div key={rider.id}>
          {index + 1}. {rider.name} - {rider.points} points
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
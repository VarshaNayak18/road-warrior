import { useEffect, useState } from "react";
import { getAllRiders } from "../services/riderService";

function Dashboard() {
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    loadRiders();
  }, []);

  async function loadRiders() {
    const { data, error } = await getAllRiders();

    if (error) {
      console.error(error);
      return;
    }

    setRiders(data);
  }

  return (
    <div>
      <h1>Registered Riders</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Points</th>
            <th>Referral Code</th>
          </tr>
        </thead>

        <tbody>
          {riders.map((rider) => (
            <tr key={rider.id}>
              <td>{rider.id}</td>
              <td>{rider.name}</td>
              <td>{rider.phone}</td>
              <td>{rider.city}</td>
              <td>{rider.points}</td>
              <td>{rider.referral_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
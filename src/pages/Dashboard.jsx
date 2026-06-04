import "./Dashboard.css";

import { useEffect, useState } from "react";
import {
  getAllRiders,
  getAnalytics,
} from "../services/riderService";

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalRiders: 0,
    evInterested: 0,
    totalReferrals: 0,
    topReferrer: "None",
  });

  const [riders, setRiders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCity, setSelectedCity] = useState("All");

  useEffect(() => {
    loadAnalytics();
    loadRiders();
  }, []);

  async function loadAnalytics() {
    const { data, error } = await getAnalytics();

    if (error) {
      console.error(error);
      return;
    }

    const totalRiders = data.length;

    const evInterested = data.filter(
      (rider) => rider.ev_openness === "Yes"
    ).length;

    const totalReferrals = data.reduce(
      (sum, rider) => sum + (rider.referral_count || 0),
      0
    );

    const topReferrer =
      [...data].sort(
        (a, b) =>
          (b.referral_count || 0) -
          (a.referral_count || 0)
      )[0];

    setAnalytics({
      totalRiders,
      evInterested,
      totalReferrals,
      topReferrer: topReferrer?.name || "None",
    });
  }

  async function loadRiders() {
    const { data, error } = await getAllRiders();

    if (error) {
      console.error(error);
      return;
    }

    setRiders(data);
  }

  const filteredRiders = riders.filter((rider) => {
    const matchesName = rider.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
    
    const matchesCity =
     selectedCity === "All" ||
     rider.city === selectedCity;
    
    return matchesName && matchesCity;
  });

  const cities = [
    "All",
    ...new Set(riders.map((rider) => rider.city))
  ];

  return (
    <div className="dashboard">
      <h1>📊 Analytics Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>Total Riders</h2>
          <p>{analytics.totalRiders}</p>
        </div>

        <div className="card">
          <h2>EV Interested</h2>
          <p>{analytics.evInterested}</p>
        </div>

        <div className="card">
          <h2>Total Referrals</h2>
          <p>{analytics.totalReferrals}</p>
        </div>

        <div className="card">
          <h2>Top Referrer</h2>
          <p>{analytics.topReferrer}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "30px" }}>
        Registered Riders
      </h2>

      <input
      type="text"
      placeholder="Search rider by name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: "10px",
        width: "300px",
        marginBottom: "20px",
      }}
      />

      <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="All">All Cities</option>
        <option value="Bengaluru">Bengaluru</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
      </select>

      <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
      style={{
        padding: "10px",
        marginLeft: "10px",
        marginBottom: "20px",
      }}
      >
        
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>



      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>EV Interest</th>
            <th>Points</th>
            <th>Referrals</th>
          </tr>
        </thead>

        <tbody>
          {filteredRiders.map((rider) => (
            <tr key={rider.id}>
              <td>{rider.id}</td>
              <td>{rider.name}</td>
              <td>{rider.phone}</td>
              <td>{rider.city}</td>
              <td>{rider.ev_openness}</td>
              <td>{rider.points}</td>
              <td>{rider.referral_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
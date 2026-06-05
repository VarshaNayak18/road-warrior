import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

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

  evLeads: 0,
  uninsured: 0,

  vehicleBreakdown: {},
  cityBreakdown: {},

  topReferrers: [],
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

    const evLeads = data.filter(
      (rider) => rider.ev_openness === "Yes"
    ).length;

    const uninsured = data.filter(
      (rider) =>
        rider.accidental_insurance === "No" ||
      rider.health_insurance === "No"
    ).length;

    const vehicleBreakdown = {};
    data.forEach((rider) => {
      const vehicle =
      rider.vehicle_type || "Unknown";
      vehicleBreakdown[vehicle] =
      (vehicleBreakdown[vehicle] || 0) + 1;
    });


    const totalReferrals = data.reduce(
      (sum, rider) => sum + (rider.referral_count || 0),
      0
    );

    const topReferrers = [...data]
    .sort(
    (a, b) =>
      (b.referral_count || 0) -
      (a.referral_count || 0)
    )
    .slice(0, 5);
    
    const cityBreakdown = {};

data.forEach((rider) => {
  const city =
    rider.city?.trim().toLowerCase();

  const normalizedCity =
    city === "bangalore"
      ? "Bengaluru"
      : city.charAt(0).toUpperCase() +
        city.slice(1);

  cityBreakdown[normalizedCity] =
    (cityBreakdown[normalizedCity] || 0) + 1;
});

    setAnalytics({
      totalRiders,
      evInterested,
      totalReferrals,
      
      evLeads,
      uninsured,
      
      vehicleBreakdown,
      cityBreakdown,
      
      topReferrers,
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

  const vehicleData = Object.entries(
  analytics.vehicleBreakdown || {}
).map(([name, value]) => ({
  name,
  value,
}));
  
const cityData = Object.entries(
  analytics.cityBreakdown || {}
).map(([name, value]) => ({
  name,
  value,
}));

  return (
    <div className="dashboard">
      <h2>📊 Analytics Dashboard</h2>

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
          <h2>EV Hot Leads</h2>
          <p>{analytics.evLeads}</p>
        </div>

        <div className="card">
          <h2>Insurance Leads</h2>
          <p>{analytics.uninsured}</p>
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
  {cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>

      <h2>🚗 Vehicle Breakdown</h2>

<div
  style={{
    width: "100%",
    height: "350px",
  }}
>
  <ResponsiveContainer
    width="100%"
    height="100%"
  >
    
    <PieChart>
      <Pie
  data={vehicleData}
  dataKey="value"
  nameKey="name"
  outerRadius={120}
  label
>
  {vehicleData.map((entry, index) => (
    <Cell
      key={index}
      fill={
        COLORS[
          index % COLORS.length
        ]
      }
    />
  ))}
</Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

<h2>🏙️ City Breakdown</h2>

<div
  style={{
    width: "100%",
    height: "350px",
  }}
>
  <ResponsiveContainer
    width="100%"
    height="100%"
  >
    <BarChart data={cityData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
  dataKey="value"
  fill="#3B82F6"
  radius={[8, 8, 0, 0]}
/>
    </BarChart>
  </ResponsiveContainer>
</div>

<div className="leaderboard-card">
  <h2>🏆 Top Referrers</h2>

  {analytics.topReferrers?.map(
    (rider, index) => (
      <div
        key={rider.id}
        className="leaderboard-row"
      >
        <span className="rank">
          #{index + 1}
        </span>

        <span className="name">
          {rider.name}
        </span>

        <span className="stats">
          {rider.referral_count} referrals
        </span>

        <span className="points">
          {rider.points} pts
        </span>
      </div>
    )
  )}
</div>

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
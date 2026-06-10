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

import { Link } from "react-router-dom";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

import { useEffect, useState } from "react";

import Papa from "papaparse";

import {
  getAllRiders,
  getAnalytics,
  updateFollowUp,
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

  leadCounts: {},
});

  const [riders, setRiders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCity, setSelectedCity] = useState("All");

  const [selectedLead, setSelectedLead] =
  useState("All");

  const platformCounts = {};

riders.forEach((rider) => {
  if (!rider.delivery_platform) return;

  const platforms =
    rider.delivery_platform
      .split(",")
      .map((p) => p.trim());

  const key = platforms.sort().join(" + ");

  platformCounts[key] =
    (platformCounts[key] || 0) + 1;
});

const platformOverlapData =
  Object.entries(platformCounts).map(
    ([platforms, count]) => ({
      platforms,
      count,
    })
  );

  const [selectedPincode, setSelectedPincode] =
  useState("All");

  const pincodes = [
  "All",
  ...new Set(
    riders
      .map((rider) => rider.pincode)
      .filter(Boolean)
  ),
];

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

  
  const leadCounts = {
  EV_SALE_LEAD: 0,
  EV_RENTAL_LEAD: 0,
  RETROFIT_LEAD: 0,
  PERSONAL_INSURANCE_LEAD: 0,
  BIKE_INSURANCE_LEAD: 0,
  PRODUCT_LEAD: 0,
  };
  data.forEach((rider) => {
    rider.lead_type?.forEach((lead) => {
      leadCounts[lead]++;
    });
  });
});

const followUpPending =
  data.filter(
    (rider) => !rider.follow_up
  ).length;

    setAnalytics({
      totalRiders,
      evInterested,
      totalReferrals,
      
      evLeads,
      uninsured,
      
      vehicleBreakdown,
      cityBreakdown,
      
      topReferrers,

      followUpPending,
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

  async function toggleFollowUp(
  rider
) {
  const { error } =
    await updateFollowUp(
      rider.id,
      rider.follow_up
    );

  if (error) {
    console.error(error);
    return;
  }

  loadRiders();
}

  const filteredRiders = riders.filter((rider) => {
  const matchesName = rider.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCity =
    selectedCity === "All" ||
    rider.city === selectedCity;

  const matchesLead =
    selectedLead === "All" ||
    rider.lead_type?.includes(selectedLead);

  const matchesPincode =
    selectedPincode === "All" ||
    rider.pincode === selectedPincode;

  return (
    matchesName &&
    matchesCity &&
    matchesLead &&
    matchesPincode
  );
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

function exportCSV() {
  const csv = Papa.unparse(filteredRiders);

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "road-warrior-riders.csv";

  link.click();
}

function exportEVLeads() {
  const evLeads = riders.filter(
    (rider) =>
      rider.lead_type?.includes(
        "EV_SALE_LEAD"
      )
  );

  const csv = Papa.unparse(evLeads);

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const link = document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download = "ev-leads.csv";

  link.click();
}

  return (
    <div className="dashboard-title">
      <h2>📊 Analytics Dashboard</h2>

      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  }}
>

  <button
    onClick={() => {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }}
  >
    Logout
  </button>
</div>

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

        <div className="card">
          <h2>Follow-Ups Pending</h2>
          <p>{analytics.followUpPending}</p>
        </div>

        <div className="card">
  <h2>Multi-Platform Riders</h2>
  <p>
    {
      riders.filter(
        (r) =>
          r.delivery_platform?.includes(",")
      ).length
    }
  </p>
</div>
      </div>

      <h2 style={{ marginTop: "30px" }}>
        Registered Riders
      </h2>

      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  }}
>
  <div className="toolbar">

  <input
    type="text"
    placeholder="🔍 Search rider..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

  <select
    value={selectedCity}
    onChange={(e) =>
      setSelectedCity(e.target.value)
    }
  >
    {cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>

  <select
    value={selectedPincode}
    onChange={(e) =>
      setSelectedPincode(e.target.value)
    }
  >
    {pincodes.map((pin) => (
      <option key={pin} value={pin}>
        {pin}
      </option>
    ))}
  </select>

  <select
    value={selectedLead}
    onChange={(e) =>
      setSelectedLead(e.target.value)
    }
  >
    <option value="All">
      All Leads
    </option>

    <option value="EV_SALE_LEAD">
      EV Sale
    </option>

    <option value="EV_RENTAL_LEAD">
      EV Rental
    </option>

    <option value="RETROFIT_LEAD">
      Retrofit
    </option>

    <option value="PERSONAL_INSURANCE_LEAD">
      Personal Insurance
    </option>

    <option value="BIKE_INSURANCE_LEAD">
      Bike Insurance
    </option>

    <option value="PRODUCT_LEAD">
      Product Lead
    </option>
  </select>

  <button onClick={exportCSV}>
    📥 Export CSV
  </button>

  <button onClick={exportEVLeads}>
    ⚡ Export EV Leads
  </button>

</div>
</div>

      <h2>🚗 Vehicle Breakdown</h2>

<div style={{ width: "100%", height: 350 }}>
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

<div className="leaderboard-city">
  <h2>🏙️ City Breakdown</h2>

<div
  style={{
    width: "100%",
    height: 350,
  }}
>
  <ResponsiveContainer
    width="100%"
    height="100%"
  >
    <BarChart data={cityData}>
      <XAxis
  dataKey="name"
  angle={-20}
  textAnchor="end"
  height={70}
/>
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
</div>

<div className="leaderboard-card">
  <h2>📦 Platform Overlap View</h2>

  {platformOverlapData.map(
    (item, index) => (
      <div
        key={index}
        className="leaderboard-row"
      >
        <span className="name">
          {item.platforms}
        </span>

        <span className="points">
          {item.count} riders
        </span>
      </div>
    )
  )}
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

<h3 className="rider-count">
  Showing {filteredRiders.length} Riders
</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>PIN Code</th>
            <th>EV Interest</th>
            <th>Lead Types</th>
            <th>Points</th>
            <th>Referrals</th>
            <th>Follow Up</th>
          </tr>
        </thead>

        <tbody>
          {filteredRiders.map((rider) => (
            <tr key={rider.id}>
              <td>{rider.id}</td>
              <td>{rider.name}</td>
              <td>{rider.phone}</td>
              <td>{rider.city}</td>
              <td>{rider.pincode}</td>
              <td>{rider.ev_openness}</td>
              <td>{rider.points}</td>
              <td>{rider.referral_count}</td>
              <td>{rider.lead_type?.join(", ")}</td>
              <td>
                <input
                type="checkbox"
                checked={
                  rider.follow_up || false
                }
                onChange={() =>
                  toggleFollowUp(rider)
                }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
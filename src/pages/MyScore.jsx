import { useState } from "react";
import { getRiderByPhone } from "../services/riderService";

function MyScore() {
  const [phone, setPhone] = useState("");
  const [rider, setRider] = useState(null);

  async function handleSearch() {
    const { data, error } =
      await getRiderByPhone(phone);

    if (error) {
      alert("Rider not found");
      return;
    }

    setRider(data);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏆 My Score</h1>

      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <button
        onClick={handleSearch}
        style={{ marginLeft: "10px" }}
      >
        Check Score
      </button>

      {rider && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{rider.name}</h2>

          <p>
            <strong>Phone:</strong>{" "}
            {rider.phone}
          </p>

          <p>
            <strong>Referral Code:</strong>{" "}
            {rider.referral_code}
          </p>

          <p>
            <strong>Points:</strong>{" "}
            {rider.points}
          </p>

          <p>
            <strong>Referrals:</strong>{" "}
            {rider.referral_count}
          </p>
        </div>
      )}
    </div>
  );
}

export default MyScore;
import { useState } from "react";
import { registerRider } from "../services/riderService";
import { generateReferralCode } from "../utils/referral";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    vehicleType: "",
    evInterest: "",
    referralCode: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const rider = {
    name: formData.name,
    phone: formData.phone,
    city: formData.city,
    vehicle_type: formData.vehicleType,
    ev_openness: formData.evInterest,
    referral_code: generateReferralCode(),
    referred_by: formData.referralCode,
  };

  const { data, error } = await registerRider(rider);

  if (error) {
    console.error(error);

    if (error.code === "23505") {
      alert("Phone number already registered");
    } else {
      alert("Registration failed");
    }

    return;
  }

  console.log(data);
  alert("Registration successful!");

  setFormData({
    name: "",
    phone: "",
    city: "",
    vehicleType: "",
    evInterest: "",
    referralCode: "",
  });
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Road Warrior Registration</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
        >
          <option value="">Select Vehicle</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="EV">EV</option>
        </select>

        <br /><br />

        <select
          name="evInterest"
          value={formData.evInterest}
          onChange={handleChange}
        >
          <option value="">Open to EV?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Need More Info">
            Need More Info
          </option>
        </select>

        <br /><br />

        <input
          type="text"
          name="referralCode"
          placeholder="Referral Code"
          value={formData.referralCode}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;
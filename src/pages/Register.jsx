import {
  registerRider,
  findRiderByReferralCode,
  updateReferrer
} from "../services/riderService";

import { useState } from "react";
import { generateReferralCode } from "../utils/referral";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    
    deliveryPlatform: "",
    experienceYears: "",
    
    vehicleType: "",
    vehicleBrand: "",
    chargingMethod: "",
    weeklyExpense: "",
    maintenanceExpense: "",

    generalChallenges: [],
    evChallenges: [],
    petrolChallenges: [],

    accidentalInsurance: "",
    healthInsurance: "",
    accidentExpense: "",

    evInterest: "",
    switchFactors: [],
    interestedServices: [],

    referred: "No",
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

  if (formData.referralCode) {
    const { data: referrer } =
    await findRiderByReferralCode(
      formData.referralCode
    );
    
    if (referrer) {
      await updateReferrer(referrer);
    }
  }

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

      {/* SECTION A */}
      <h2>Section A — Basic Profile</h2>

      Name Input
      Phone Input
      City Input
      Delivery Platform Dropdown
      Experience Input

      {/* SECTION B */}
      <h2>Section B — Current Vehicle</h2>

      Vehicle Type Dropdown
      Vehicle Brand Input
      Charging Method Dropdown
      Weekly Expense Input
      Maintenance Expense Input

      {/* SECTION C */}
      <h2>Section C — Challenges</h2>

      General Challenges Checkboxes

      EV Challenges
      (only show if vehicle = EV)

      Petrol Challenges
      (only show if vehicle = Petrol)

      {/* SECTION D */}
      <h2>Section D — Insurance</h2>

      Accidental Insurance
      Health Insurance
      Accident Expense

      {/* SECTION E */}
      <h2>Section E — Openness to Change</h2>

      EV Interest

      Switch Factors Checkboxes

      Interested Services Checkboxes

      {/* SECTION F */}
      <h2>Section F — Referral</h2>

      Referred? Yes/No

      Referral Code
      (only show if Yes)

      <button type="submit">
        Register
      </button>

    </form>
  </div>
);
}

export default Register;
import {
  registerRider,
  findRiderByReferralCode,
  updateReferrer
} from "../services/riderService";

import { translations } from "../translations";

import { useState } from "react";
import { generateReferralCode } from "../utils/referral";

function Register() {
  const [language, setLanguage] = useState("en");

  const t = translations[language];

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

  const handleCheckboxChange = (event) => {
  const { name, value, checked } = event.target;

  setFormData((prev) => ({
    ...prev,
    [name]: checked
      ? [...prev[name], value]
      : prev[name].filter(
          (item) => item !== value
        ),
  }));
};
  
  const handleSubmit = async (event) => {
    event.preventDefault();

  const rider = {
  name: formData.name,
  phone: formData.phone,
  city: formData.city,

  delivery_platform: formData.deliveryPlatform,
  experience_years: formData.experienceYears,

  vehicle_type: formData.vehicleType,
  vehicle_brand: formData.vehicleBrand,
  charging_method: formData.chargingMethod,

  weekly_expense: formData.weeklyExpense,
  maintenance_expense: formData.maintenanceExpense,

  general_challenges: formData.generalChallenges,
  ev_challenges: formData.evChallenges,
  petrol_challenges: formData.petrolChallenges,

  accidental_insurance: formData.accidentalInsurance,
  health_insurance: formData.healthInsurance,
  accident_expense: formData.accidentExpense,

  ev_openness: formData.evInterest,

  switch_factors: formData.switchFactors,
  interested_services: formData.interestedServices,

  referral_code: generateReferralCode(),
  referred_by: formData.referralCode,
  referred: formData.referred,
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
};

return (
  <div style={{ padding: "20px" }}>

    <form onSubmit={handleSubmit}>

      <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
>
  <option value="en">English</option>
  <option value="hi">हिन्दी</option>
</select>

<h1>{t.title}</h1>

      {/* SECTION A */}
      <h2>{t.basicProfile}</h2>

<input
  type="text"
  name="name"
  placeholder={t.fullName}
  value={formData.name}
  onChange={handleChange}
/>

<br /><br />

<input
  type="text"
  name="phone"
  placeholder={t.phone}
  value={formData.phone}
  onChange={handleChange}
/>

<br /><br />

<input
  type="text"
  name="city"
  placeholder={t.city}
  value={formData.city}
  onChange={handleChange}
/>

<br /><br />

<label>{t.deliveryPlatform}</label>

<br />

<select
  name="deliveryPlatform"
  value={formData.deliveryPlatform}
  onChange={handleChange}
>
  <option value="">Select Platform</option>
  <option>Swiggy</option>
  <option>Zomato</option>
  <option>Blinkit</option>
  <option>Porter</option>
  <option>Dunzo</option>
  <option>{t.other}</option>
</select>

<br /><br />

<input
  type="number"
  name="experienceYears"
  placeholder={t.experienceYears}
  value={formData.experienceYears}
  onChange={handleChange}
/>
      
      {/* SECTION B */}
<h2>{t.vehicleSection}</h2>

<label>{t.vehicleType}</label>

<br />

<select
  name="vehicleType"
  value={formData.vehicleType}
  onChange={handleChange}
>
  <option value="">Select Vehicle</option>
  <option value="Petrol">{t.petrol}</option>
  <option value="Diesel">{t.diesel}</option>
  <option value="Electric">{t.electric}</option>
  <option value="Other">{t.other}</option>
</select>

<br /><br />

<input
  type="text"
  name="vehicleBrand"
  placeholder={t.vehicleBrand}
  value={formData.vehicleBrand}
  onChange={handleChange}
/>

<br /><br />

<label>{t.chargingMethod}</label>

<br />

<select
  name="chargingMethod"
  value={formData.chargingMethod}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option>Petrol Pump</option>
  <option>Home Charging</option>
  <option>Battery Swapping Station</option>
  <option>{t.other}</option>
</select>

<br /><br />

<input
  type="number"
  name="weeklyExpense"
  placeholder={t.weeklyExpense}
  value={formData.weeklyExpense}
  onChange={handleChange}
/>

<br /><br />

<input
  type="number"
  name="maintenanceExpense"
  placeholder={t.maintenanceExpense}
  value={formData.maintenanceExpense}
  onChange={handleChange}
/>

      {/* SECTION C */}
<h2>{t.challengesSection}</h2>

<h3>{t.topChallenges}</h3>

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="High Fuel Cost"
    checked={formData.generalChallenges.includes("High Fuel Cost")}
    onChange={handleCheckboxChange}
  />
  {t.highFuelCost}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="Frequent Breakdown"
    checked={formData.generalChallenges.includes("Frequent Breakdown")}
    onChange={handleCheckboxChange}
  />
  {t.frequentBreakdown}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="No Nearby Charging Station"
    checked={formData.generalChallenges.includes("No Nearby Charging Station")}
    onChange={handleCheckboxChange}
  />
  {t.noChargingStation}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="Battery Range Anxiety"
    checked={formData.generalChallenges.includes("Battery Range Anxiety")}
    onChange={handleCheckboxChange}
  />
  {t.rangeAnxiety}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="Repair Costs"
    checked={formData.generalChallenges.includes("Repair Costs")}
    onChange={handleCheckboxChange}
  />
  {t.repairCosts}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="generalChallenges"
    value="Long Refuelling Time"
    checked={formData.generalChallenges.includes("Long Refuelling Time")}
    onChange={handleCheckboxChange}
  />
  {t.refuellingTime}
</label>

{formData.vehicleType === "Electric" && (
  <>
    <h3>{t.evChallenges}</h3>

    <label>
      <input
        type="checkbox"
        name="evChallenges"
        value="Battery Drains Too Fast"
        checked={formData.evChallenges.includes("Battery Drains Too Fast")}
        onChange={handleCheckboxChange}
      />
      {t.batteryDrain}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="evChallenges"
        value="Swapping Station Too Far"
        checked={formData.evChallenges.includes("Swapping Station Too Far")}
        onChange={handleCheckboxChange}
      />
      {t.swapFar}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="evChallenges"
        value="Long Charging Time At Home"
        checked={formData.evChallenges.includes("Long Charging Time At Home")}
        onChange={handleCheckboxChange}
      />
      {t.longCharging}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="evChallenges"
        value="Vehicle Not Powerful Enough"
        checked={formData.evChallenges.includes("Vehicle Not Powerful Enough")}
        onChange={handleCheckboxChange}
      />
      {t.lowPower}
    </label>
  </>
)}

{formData.vehicleType === "Petrol" && (
  <>
    <h3>{t.petrolChallenges}</h3>

    <label>
      <input
        type="checkbox"
        name="petrolChallenges"
        value="Fuel Price Too High"
        checked={formData.petrolChallenges.includes("Fuel Price Too High")}
        onChange={handleCheckboxChange}
      />
      {t.fuelPrice}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="petrolChallenges"
        value="Frequent Engine Issues"
        checked={formData.petrolChallenges.includes("Frequent Engine Issues")}
        onChange={handleCheckboxChange}
      />
      {t.engineIssues}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="petrolChallenges"
        value="Pollution Fine Risk"
        checked={formData.petrolChallenges.includes("Pollution Fine Risk")}
        onChange={handleCheckboxChange}
      />
      {t.pollutionRisk}
    </label>

    <br />

    <label>
      <input
        type="checkbox"
        name="petrolChallenges"
        value="High Servicing Cost"
        checked={formData.petrolChallenges.includes("High Servicing Cost")}
        onChange={handleCheckboxChange}
      />
      {t.highServiceCost}
    </label>
  </>
)}

      {/* SECTION D */}
<h2>{t.insuranceSection}</h2>

<label>{t.accidentalInsurance}</label>

<br />

<select
  name="accidentalInsurance"
  value={formData.accidentalInsurance}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Yes">{t.yes}</option>
  <option value="No">{t.no}</option>
  <option value="Not Sure">{t.notSure}</option>
</select>

<br /><br />

<label>{t.healthInsurance}</label>

<br />

<select
  name="healthInsurance"
  value={formData.healthInsurance}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Yes">{t.yes}</option>
  <option value="No">{t.no}</option>
  <option value="Not Sure">{t.notSure}</option>
</select>

<br /><br />

<label>{t.accidentExpense}</label>

<br />

<select
  name="accidentExpense"
  value={formData.accidentExpense}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Yes">{t.yes}</option>
  <option value="No">{t.no}</option>
</select>

      {/* SECTION E */}
<h2>{t.evSection}</h2>

<label>{t.evInterest}</label>

<br />

<select
  name="evInterest"
  value={formData.evInterest}
  onChange={handleChange}
>
  <option value="">Select</option>

  <option value="Yes">
    {t.yes}
  </option>

  <option value="No">
    {t.no}
  </option>

  <option value="Already On EV">
    {t.alreadyEV}
  </option>

  <option value="Need More Information">
    {t.needInfo}
  </option>
</select>

<br /><br />

<h3>{t.switchFactors}</h3>

<label>
  <input
    type="checkbox"
    name="switchFactors"
    value="Lower Rental Cost"
    checked={formData.switchFactors.includes("Lower Rental Cost")}
    onChange={handleCheckboxChange}
  />
  {t.lowerRental}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="switchFactors"
    value="Better Battery Range"
    checked={formData.switchFactors.includes("Better Battery Range")}
    onChange={handleCheckboxChange}
  />
  {t.betterRange}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="switchFactors"
    value="Swap Stations Nearby"
    checked={formData.switchFactors.includes("Swap Stations Nearby")}
    onChange={handleCheckboxChange}
  />
  {t.swapNearby}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="switchFactors"
    value="Income Guarantee"
    checked={formData.switchFactors.includes("Income Guarantee")}
    onChange={handleCheckboxChange}
  />
  {t.incomeGuarantee}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="switchFactors"
    value="Employer Subsidy"
    checked={formData.switchFactors.includes("Employer Subsidy")}
    onChange={handleCheckboxChange}
  />
  {t.employerSubsidy}
</label>

<br /><br />

<h3>{t.interestedServices}</h3>

<label>
  <input
    type="checkbox"
    name="interestedServices"
    value="EV Rental Offer"
    checked={formData.interestedServices.includes("EV Rental Offer")}
    onChange={handleCheckboxChange}
  />
  {t.evRentalOffer}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="interestedServices"
    value="Insurance Quote"
    checked={formData.interestedServices.includes("Insurance Quote")}
    onChange={handleCheckboxChange}
  />
  {t.insuranceQuote}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="interestedServices"
    value="Retrofit Information"
    checked={formData.interestedServices.includes("Retrofit Information")}
    onChange={handleCheckboxChange}
  />
  {t.retrofitInfo}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="interestedServices"
    value="All Of The Above"
    checked={formData.interestedServices.includes("All Of The Above")}
    onChange={handleCheckboxChange}
  />
  {t.allAbove}
</label>

<br />

<label>
  <input
    type="checkbox"
    name="interestedServices"
    value="None"
    checked={formData.interestedServices.includes("None")}
    onChange={handleCheckboxChange}
  />
  {t.none}
</label>

      {/* SECTION F */}
<h2>{t.referralSection}</h2>

<label>{t.referred}</label>

<br />

<select
  name="referred"
  value={formData.referred}
  onChange={handleChange}
>
  <option value="No">
    {t.no}
  </option>

  <option value="Yes">
    {t.yes}
  </option>
</select>

<br /><br />

{formData.referred === "Yes" && (
  <>
    <input
      type="text"
      name="referralCode"
      placeholder={t.referralCode}
      value={formData.referralCode}
      onChange={handleChange}
    />

    <br /><br />
  </>
)}

      <button type="submit">
        Register
      </button>

    </form>
  </div>
);
}

export default Register;
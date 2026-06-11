import {
  registerRider,
  findRiderByReferralCode,
  updateReferrer
} from "../services/riderService";
import { translations } from "../translations";
import { useState } from "react";
import { generateReferralCode } from "../utils/referral";
import { supabase } from "../lib/supabase";
import {
  getLeadTypes,
} from "../utils/leadClassifier";
import {
  useGoogleReCaptcha
} from "react-google-recaptcha-v3";
import "./Register.css";
import { cities } from "../data/cities";

function Register() {

  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const [otp, setOtp] = useState("");
const [enteredOtp, setEnteredOtp] = useState("");
const [otpVerified, setOtpVerified] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    pincode:"",
    
    deliveryPlatform: [],
    otherPlatform: "",
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
    productInterest: [],

    referred: "No",
    referralCode: "",

    privacyConsent: false,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const sendOTP = async () => {
     alert("NEW OTP FUNCTION RUNNING");
  const generatedOtp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  setOtp(generatedOtp);

  await supabase
    .from("otp_verifications")
    .upsert({
      mobile: formData.phone,
      otp: generatedOtp,
    });

  alert(`Demo OTP: ${generatedOtp}`);
};

const verifyOTP = async () => {
  const { data } = await supabase
    .from("otp_verifications")
    .select("*")
    .eq("mobile", formData.phone)
    .single();

  if (!data) {
    alert("OTP not found");
    return;
  }

  if (data.otp === enteredOtp) {
    setOtpVerified(true);
    alert("OTP Verified");
  } else {
    alert("Invalid OTP");
  }
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

  const {
  executeRecaptcha
} = useGoogleReCaptcha();

  const [currentSection, setCurrentSection] =
  useState(1);

  

  const leadTypes =
    getLeadTypes(formData);

  function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!otpVerified) {
  alert("Please verify OTP first");
  return;
}

    if (!formData.privacyConsent) {
  alert(
    "Please accept the privacy consent before submitting."
  );
  return;
}

    if (formData.website) {
  return;
}

    if (
  !formData.privacyConsent
) {
  alert(
    "Please accept privacy consent."
  );

  return;
}

      
const lastSubmissions =
  JSON.parse(
    localStorage.getItem("submissions") || "[]"
  );

const now = Date.now();

const recentSubmissions =
  lastSubmissions.filter(
    (time) =>
      now - time < 60 * 1000
  ); // last 1 minute

if (recentSubmissions.length >= 3) {
  alert(
    "Too many registrations. Please wait 1 minute."
  );
  return;
}

    if (!executeRecaptcha) {
  alert(
    "reCAPTCHA not ready"
  );
  return;
}

const token =
  await executeRecaptcha(
    "register_rider"
  );

console.log(
  "reCAPTCHA token:",
  token
);

     const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(formData.phone)) {
    alert(
      "Please enter a valid 10-digit Indian mobile number."
    );
    return;
  }

  const lastSubmit =
  localStorage.getItem("lastSubmit");

if (
  lastSubmit &&
  Date.now() - Number(lastSubmit) < 30000
) {
  alert(
    "Please wait 30 seconds before submitting again."
  );
  return;
}
    
    const referralCode = generateReferralCode();
    const rider = {
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      pincode: formData.pincode,
      delivery_platform: formData.deliveryPlatform.join(", "),
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
      lead_type: leadTypes,
      
      referral_code: generateReferralCode(),
      referred_by: formData.referralCode,
      referred: formData.referred,
      
      points: 10,
      referral_count: 0,
      referral_code: generateReferralCode(),

      follow_up: formData.followUpStatus,
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

    localStorage.setItem(
  "submissions",
  JSON.stringify(recentSubmissions)
);
    
    console.log(data);
    alert("Registration successful!");

    localStorage.setItem(
  "lastSubmit",
  Date.now()
);
  
    recentSubmissions.push(now);
    
    if (formData.referralCode) {
      const { data: referrer } =
      await findRiderByReferralCode(
        formData.referralCode
      );
      
      if (referrer) {
        const result =
        await updateReferrer(referrer);
        
        if (result.milestone) {
          alert(
            `${referrer.name} reached ${result.data.referral_count} referrals!`
          );
        }
      }
    }
    
    setFormData({
      name: "",
      phone: "",
      city: "",
      pincode: "",
      deliveryPlatform: [],
      experienceYears: "",
      
      vehicleType: "",
      otherVehicleType: "",
      vehicleBrand: "",
      chargingMethod: "",
      otherFuelMethod: "",
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

      productInterest: [],
      
      referred: "No",
      referralCode: "",

      followUp: "Pending",
      website: "",
    });
  };

  const validateSection1 = () => {
  if (!formData.name.trim()) {
    alert("Please enter your full name");
    return false;
  }

  if (!formData.phone.trim()) {
    alert("Please enter mobile number");
    return false;
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(formData.phone)) {
    alert("Please enter a valid mobile number");
    return false;
  }

  if (!formData.city.trim()) {
    alert("Please select a city");
    return false;
  }

  if (!formData.pincode.trim()) {
    alert("Please enter PIN Code");
    return false;
  }

  const pincodeRegex = /^\d{6}$/;

  if (!pincodeRegex.test(formData.pincode)) {
    alert("PIN Code must be exactly 6 digits");
    return false;
  }

  if (
    !formData.deliveryPlatform ||
    formData.deliveryPlatform.length === 0
  ) {
    alert(
      "Please select at least one delivery platform"
    );
    return false;
  }

  return true;
};
  
const validateSection2 = () => {
  if (!formData.vehicleType) {
    alert("Please select vehicle type");
    return false;
  }

  if (!formData.vehicleBrand) {
    alert("Please enter vehicle brand");
    return false;
  }

  if (!formData.chargingMethod) {
    alert(
      "Please select charging/fuel method"
    );
    return false;
  }

  return true;
};
  return (
    <div className="form-container">
  <div style={{ padding: "20px" }}>
    
    <form onSubmit={handleSubmit}>

       <input
  type="text"
  name="website"
  value={formData.website}
  onChange={handleChange}
  style={{
    display: "none",
  }}
/>


<h3>Select Language</h3>
     <div className="language-selector">
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="en">English</option>
    <option value="hi">हिन्दी</option>
    <option value="kn">ಕನ್ನಡ</option>
  </select>
</div>

      <div
      style={{
        marginBottom: "25px",
        }}
        >
          <div
          style={{
            width: "100%",
            backgroundColor: "#e5e7eb",
            borderRadius: "20px",
            height: "15px",
          }}
          >
            <div
            style={{
              width: `${(currentSection / 6) * 100}%`,
              backgroundColor: "#22c55e",
              height: "15px",
              borderRadius: "20px",
              transition: "0.3s",
            }}
            />
          </div>
            
            <p
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
            >
              Step {currentSection} of 6
              </p>
        </div>

        
      
      <h2>{t.title}</h2>

      <p className="subtitle">
  {t.subtitle}
</p>
<br />

      {/* SECTION A */}

      {currentSection === 1 && (
        <div className="section-card">
        <>
        <h3>{t.basicProfile}</h3>

        <input
        type="text"
      name="name"
      placeholder={t.fullName}
      value={formData.name}
      onChange={handleChange}
      />
      <br /><br />
      
      <input
      type="tel"
      placeholder={t.phone}
      name="phone"
      maxLength="10"
      pattern="[0-9]{10}"
      value={formData.phone}
      onChange={handleChange}
      />
      <br /><br />

      <button
  type="button"
  onClick={sendOTP}
>
  {t.sendOTP}
</button>

<br />
<br />

<div className="otp-row">
  <input
    type="text"
    placeholder={t.EnterOTP}
    value={enteredOtp}
    onChange={(e) =>
      setEnteredOtp(e.target.value)
    }
  />

  <button
    type="button"
    onClick={verifyOTP}
  >
    {t.verifyOTP}
  </button>
</div>
<br/ >

<h4>{t.city}</h4>
      
      <input
  type="text"
  name="city"
  placeholder={t.city}
  value={formData.city}
  onChange={handleChange}
  list="cities"
/>

<datalist id="cities">
  {cities.map((city) => (
    <option
      key={city.en}
      value={city[language]}
    />
  ))}

  <option value={t.other} />
</datalist>

{formData.city === t.other && (
  <input
    type="text"
    name="otherCity"
    placeholder={t.city}
    value={formData.otherCity || ""}
    onChange={handleChange}
  />
)}

      <input
  type="text"
  name="pincode"
  placeholder={t.pincode}
  value={formData.pincode}
  onChange={handleChange}
  maxLength="6"
/>
<br /><br />


      
      <h4>{t.deliveryPlatform}</h4>
      <div className="checkbox-grid">

{[
  "Swiggy",
  "Zomato",
  "Blinkit",
  "Porter",
  "Dunzo",
  "Other",
].map((platform) => (
  <label
  key={platform}
  className={
    formData.deliveryPlatform?.includes(
      platform
    )
      ? "platform-selected"
      : ""
  }
>
    <input
      type="checkbox"
      checked={
        formData.deliveryPlatform?.includes(
          platform
        ) || false
      }
      onChange={(e) => {
        if (e.target.checked) {
          setFormData({
            ...formData,
            deliveryPlatform: [
              ...(formData.deliveryPlatform || []),
              platform,
            ],
          });
        } else {
          setFormData({
            ...formData,
            deliveryPlatform:
              formData.deliveryPlatform.filter(
                (p) => p !== platform
              ),
          });
        }
      }}
    />
    {" "}{t.deliveryPlatforms?.[platform] || platform}
  </label>
))}
</div>

{formData.deliveryPlatform?.includes(
  "Other"
) && (
  <>
    <input
      type="text"
      placeholder="Specify Platform"
      value={
        formData.otherPlatform
      }
      onChange={(e) =>
        setFormData({
          ...formData,
          otherPlatform:
            e.target.value,
        })
      }
    />
  </>
)}

<br />
      
      <input
      type="number"
      name="experienceYears"
      placeholder={t.experienceYears}
      value={formData.experienceYears}
      onChange={handleChange}
      />

      <div>
      <button
  type="button"
  onClick={() => {
    if (validateSection1()) {
      setCurrentSection(2);
    }
  }}
>
  {t.next} →
</button>
      </div>
      </>
      </div>
    )}


      
      {/* SECTION B */}

      {currentSection === 2 && (
        <div className="section-card">
        <>
        <h3>{t.vehicleSection}</h3>

        <h4>{t.vehicleType}</h4>

      <select
      name="vehicleType"
      value={formData.vehicleType}
      onChange={handleChange}
      >
        <option value="">{t.selectVehicle}</option>
        <option value="Petrol">{t.petrol}</option>
        <option value="Diesel">{t.diesel}</option>
        <option value="Electric">{t.electric}</option>
        <option value="Other">{t.other}</option>

      </select>

      {formData.vehicleType ===
  "Other" && (
  <>
    <input
      type="text"
      placeholder={t.specifyVehicleType}
      value={
        formData.otherVehicleType
      }
      onChange={(e) =>
        setFormData({
          ...formData,
          otherVehicleType:
            e.target.value,
        })
      }
    />
    <br />
  </>
)}
      
      <input
      type="text"
      name="vehicleBrand"
      placeholder={t.vehicleBrand}
      value={formData.vehicleBrand}
      onChange={handleChange}
      />
      <br />
      
      <h4>{t.chargingMethod}</h4>
      <select
      name="chargingMethod"
      value={formData.chargingMethod}
      onChange={handleChange}
      >
        <option value="">{t.select}</option>
        <option>{t.petrolPump}</option>
        <option>{t.homeCharging}</option>
        <option>{t.batterySwappingStation}</option>
        <option>{t.other}</option>
      </select>
      <br />
      
      {formData.chargingMethod === t.other && (
  <>
    <input
      type="text"
      placeholder={t.specifyFuelOrChargingMethod}
      value={
        formData.otherFuelMethod
      }
      onChange={(e) =>
        setFormData({
          ...formData,
          otherFuelMethod:
            e.target.value,
        })
      }
    />
    <br />
  </>
)}
<br />
      
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

      <div className="button-row">
      <button
        type="button"
        onClick={() => setCurrentSection(1)}
      >
        ← {t.previous}
      </button>

      <button
        type="button"
        onClick={() => {
  if (validateSection2()) {
    setCurrentSection(3);
  }
}}
      >
        {t.next} →
      </button>
    </div>
    </>
    </div>
  )}

      
      
      
      {/* SECTION C */}

      {currentSection === 3 && (
        <div className="section-card">
        <>
        <h3>{t.challengesSection}</h3>
        
        <h4>{t.topChallenges}</h4>

        <div className="checkbox-grid">

      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.highFuelCost}
        checked={formData.generalChallenges.includes(t.highFuelCost)}
        onChange={handleCheckboxChange}
        />
        {t.highFuelCost}
      </label>
      <br />
        
      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.frequentBreakdown}
        checked={formData.generalChallenges.includes(t.frequentBreakdown)}
        onChange={handleCheckboxChange}
        />
        {t.frequentBreakdown}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.noChargingStation}
        checked={formData.generalChallenges.includes(t.noChargingStation)}
        onChange={handleCheckboxChange}
        />
        {t.noChargingStation}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.rangeAnxiety}
        checked={formData.generalChallenges.includes(t.rangeAnxiety)}
        onChange={handleCheckboxChange}
        />
        {t.rangeAnxiety}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.repairCosts}
        checked={formData.generalChallenges.includes(t.repairCosts)}
        onChange={handleCheckboxChange}
        />
        {t.repairCosts}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="generalChallenges"
        value={t.refuellingTime}
        checked={formData.generalChallenges.includes(t.refuellingTime)}
        onChange={handleCheckboxChange}
        />
        {t.refuellingTime}
      </label>
      </div>
      
      {formData.vehicleType === t.electric && (
        <>
        <h4>{t.evChallenges}</h4>

        <div className="checkbox-grid">
        
        <label>
          <input
          type="checkbox"
          name="evChallenges"
          value={t.batteryDrain}
          checked={formData.evChallenges.includes(t.batteryDrain)}
          onChange={handleCheckboxChange}
          />
          {t.batteryDrain}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"
          name="evChallenges"
          value={t.swapFar}
          checked={formData.evChallenges.includes(t.swapFar)}
          onChange={handleCheckboxChange}
          />
          {t.swapFar}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"          
          name="evChallenges"
          value={t.longCharging}
          checked={formData.evChallenges.includes(t.longCharging)}
          onChange={handleCheckboxChange}
          />
          {t.longCharging}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"
          name="evChallenges"
          value={t.lowPower}
          checked={formData.evChallenges.includes(t.lowPower)}
          onChange={handleCheckboxChange}
          />
          {t.lowPower}
        </label>
        </div>
        </>
      )}
      
      
      {formData.vehicleType === t.petrol && (
        <>
        <h4>{t.petrolChallenges}</h4>
        <div className="checkbox-grid">
        
        <label>
          <input
          type="checkbox"
          name="petrolChallenges"
          value={t.fuelPrice}
          checked={formData.petrolChallenges.includes(t.fuelPrice)}
          onChange={handleCheckboxChange}
          />
          {t.fuelPrice}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"
          name="petrolChallenges"
          value={t.engineIssues}
          checked={formData.petrolChallenges.includes(t.engineIssues)}
          onChange={handleCheckboxChange}
          />
          {t.engineIssues}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"
          name="petrolChallenges"
          value={t.pollutionRisk}
          checked={formData.petrolChallenges.includes(t.pollutionRisk)}
          onChange={handleCheckboxChange}
          />
          {t.pollutionRisk}
        </label>
        <br />
        
        <label>
          <input
          type="checkbox"
          name="petrolChallenges"
          value={t.highServiceCost}
          checked={formData.petrolChallenges.includes(t.highServiceCost)}
          onChange={handleCheckboxChange}
          />
          {t.highServiceCost}
        </label>
        </div>
        </>
      )}

      <div className="button-row">
      <button
        type="button"
        onClick={() => setCurrentSection(2)}
      >
        ← {t.previous}
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(4)}
      >
        {t.next} →
      </button>
    </div>
  </>
  </div>
      )}

      
      
      {/* SECTION D */}

      {currentSection === 4 && (
        <div className="section-card">
        <>
        <h3>{t.insuranceSection}</h3>
        
        <h4>{t.accidentalInsurance}</h4>
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
      
      <h4>{t.healthInsurance}</h4>
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
      
      <h4>{t.accidentExpense}</h4>
      <select
      name="accidentExpense"
      value={formData.accidentExpense}
      onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="Yes">{t.yes}</option>
        <option value="No">{t.no}</option>
      </select>

      <div className="button-row">
      <button
        type="button"
        onClick={() => setCurrentSection(3)}
      >
        ← {t.previous}
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(5)}
      >
        {t.next} →
      </button>
    </div>
  </>
  </div>
)}
      
      
      {/* SECTION E */}

      {currentSection === 5 && (
        <div className="section-card">
        <>
        <h3>{t.evSection}</h3>
        
        <h4>{t.evInterest}</h4>
      <select
      name="evInterest"
      value={formData.evInterest}
      onChange={handleChange}
      >
        <option value="">{t.select}</option>
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
      <br />
      
      <h4>{t.switchFactors}</h4>
      <div className="checkbox-grid">
      
      <label>
        <input
        type="checkbox"
        name="switchFactors"
        value={t.lowerRental}
        checked={formData.switchFactors.includes(t.lowerRental)}
        onChange={handleCheckboxChange}
        />
        {t.lowerRental}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="switchFactors"
        value={t.betterRange}
        checked={formData.switchFactors.includes(t.betterRange)}
        onChange={handleCheckboxChange}
        />
        {t.betterRange}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="switchFactors"
        value={t.swapNearby}
        checked={formData.switchFactors.includes(t.swapNearby)}
        onChange={handleCheckboxChange}
        />
        {t.swapNearby}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="switchFactors"
        value={t.incomeGuarantee}
        checked={formData.switchFactors.includes(t.incomeGuarantee)}
        onChange={handleCheckboxChange}
        />
        {t.incomeGuarantee}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="switchFactors"
        value={t.employerSubsidy}
        checked={formData.switchFactors.includes(t.employerSubsidy)}
        onChange={handleCheckboxChange}
        />
        {t.employerSubsidy}
      </label>
      </div>
      <br />
      
      <h4>{t.interestedServices}</h4>
      <div className="checkbox-grid">
      
      <label>
        <input
        type="checkbox"
        name="interestedServices"
        value={t.evRentalOffer}
        checked={formData.interestedServices.includes(t.evRentalOffer)}
        onChange={handleCheckboxChange}
        />
        {t.evRentalOffer}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="interestedServices"
        value={t.insuranceQuote}
        checked={formData.interestedServices.includes(t.insuranceQuote)}
        onChange={handleCheckboxChange}
        />
        {t.insuranceQuote}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="interestedServices"
        value={t.retrofitInfo}
        checked={formData.interestedServices.includes(t.retrofitInfo)}
        onChange={handleCheckboxChange}
        />
        {t.retrofitInfo}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="interestedServices"
        value={t.allAbove}
        checked={formData.interestedServices.includes(t.allAbove)}
        onChange={handleCheckboxChange}
        />
        {t.allAbove}
      </label>
      <br />
      
      <label>
        <input
        type="checkbox"
        name="interestedServices"
        value={t.none}
        checked={formData.interestedServices.includes(t.none)}
        onChange={handleCheckboxChange}
        />
        {t.none}
      </label>
      </div>

      <h4>{t.interestedProducts}</h4>
      <div className="checkbox-grid">

{[
  "Helmet",
  "Mobile Holder",
  "Riding Jacket",
  "Phone Charger",
  "GPS Tracker",
].map((product) => (
  <label
    key={product}
    style={{
      display: "block",
      marginBottom: "5px",
    }}
  >
    <input
      type="checkbox"
      checked={
        formData.productInterest?.includes(
          product
        ) || false
      }
      onChange={(e) => {
        if (e.target.checked) {
          setFormData({
            ...formData,
            productInterest: [
              ...(formData.productInterest || []),
              product,
            ],
          });
        } else {
          setFormData({
            ...formData,
            productInterest:
  (
    formData.productInterest || []
  ).filter(
    (p) => p !== product
  ),
          });
        }
      }}
    />
    {" "}
    {product}
  </label>
  
))}
</div>

<br />

      <div className="button-row">
      <button
        type="button"
        onClick={() => setCurrentSection(4)}
      >
        ← {t.previous}
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(6)}
      >
        {t.next}→
      </button>
    </div>
  </>
  </div>
      )}

      
      {/* SECTION F */}
{currentSection === 6 && (
  <div className="section-card">
  <>
  
    <h3>{t.referralSection}</h3>

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

      <h3>{t.privacyConsent}</h3>

<label className="consent-label">
  <input
    type="checkbox"
    checked={
      formData.privacyConsent
    }
    onChange={(e) =>
      setFormData({
        ...formData,
        privacyConsent:
          e.target.checked,
      })
    }
  />

  {t.statement}
</label>

<br />
<br />

<div className="button-row">
  <button
    type="button"
    onClick={() =>
      setCurrentSection(5)
    }
  >
    ← {t.previous}
  </button>

  <button type="submit">
    {t.registerRider}
  </button>
</div>
    
  </>
  </div>
)}

      </form>
      </div> 
      </div>
  )}; 
  

export default Register;
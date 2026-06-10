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

function Register() {

  const [language, setLanguage] = useState("en");

  const t = translations[language];

  const [generatedOtp,
  setGeneratedOtp] =
  useState("");

const [enteredOtp,
  setEnteredOtp] =
  useState("");

const [otpVerified,
  setOtpVerified] =
  useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    pincode:"",
    
    deliveryPlatform: [],
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

  const sendOTP = async () => {
  const otp = Math.floor(
    100000 +
      Math.random() * 900000
  ).toString();

  setGeneratedOtp(otp);

  const response =
    await fetch(
      "/api/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          phone:
            formData.phone,
          otp,
        }),
      }
    );

  const data =
    await response.json();

  if (data.success) {
    alert("OTP Sent");
  } else {
    alert(
      "Failed to send OTP"
    );
  }
};

const verifyOTP = () => {
  if (
    enteredOtp === generatedOtp
  ) {
    setOtpVerified(true);

    alert(
      "Phone Verified"
    );
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
  alert(
    "Please verify your phone number first"
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
    
    const { data: whatsappData, error: whatsappError } =
    await supabase.functions.invoke(
      "send-whatsapp",
      {
        body: {
          phone: formData.phone,
          name: formData.name,
          referralCode,
          language,
        },
      }
    );
    
    console.log("WhatsApp Data:", whatsappData);
    console.log("WhatsApp Error:", whatsappError);

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

      followUp: "Pending",
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
        <option value="kn">ಕನ್ನಡ</option>
      </select>

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
      
      <h1>{t.title}</h1>

      {/* SECTION A */}

      {currentSection === 1 && (
        <>
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
      type="tel"
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
  Send OTP
</button>

<br />
<br />

<input
  type="text"
  placeholder="Enter OTP"
  value={enteredOtp}
  onChange={(e) =>
    setEnteredOtp(
      e.target.value
    )
  }
/>

<button
  type="button"
  onClick={verifyOTP}
>
  Verify OTP
</button>
      
      <input
      type="text"
      name="city"
      placeholder={t.city}
      value={formData.city}
      onChange={handleChange}
      />
      <br /><br />

      <input
  type="text"
  name="pincode"
  placeholder="PIN Code"
  value={formData.pincode}
  onChange={handleChange}
  maxLength="6"
/>
<br /><br />
      
      <label>{t.deliveryPlatform}</label>
<br />

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
    style={{
      display: "block",
      marginBottom: "5px",
    }}
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
    {" "}{platform}
  </label>
))}

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
      onClick={() =>
        setCurrentSection(2)
      }
      >
        Next
      </button>
      </div>
      </>
    )}

      
      {/* SECTION B */}

      {currentSection === 2 && (
        <>
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

      <div>
      <button
        type="button"
        onClick={() => setCurrentSection(1)}
      >
        ← Previous
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(3)}
      >
        Next →
      </button>
    </div>
    </>
  )}

      
      
      
      {/* SECTION C */}

      {currentSection === 3 && (
        <>
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

      <div>
      <button
        type="button"
        onClick={() => setCurrentSection(2)}
      >
        ← Previous
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(4)}
      >
        Next →
      </button>
    </div>
  </>
      )}
      
      
      
      {/* SECTION D */}

      {currentSection === 4 && (
        <>
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

      <div>
      <button
        type="button"
        onClick={() => setCurrentSection(3)}
      >
        ← Previous
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(5)}
      >
        Next →
      </button>
    </div>
  </>
)}
      
      
      {/* SECTION E */}

      {currentSection === 5 && (
        <>
        <h2>{t.evSection}</h2>
        
        <label>{t.evInterest}</label><br />
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

      <div>
      <button
        type="button"
        onClick={() => setCurrentSection(4)}
      >
        ← Previous
      </button>

      <button
        type="button"
        onClick={() => setCurrentSection(6)}
      >
        Next →
      </button>
    </div>
  </>
      )}

      
      {/* SECTION F */}
{currentSection === 6 && (
  <>
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

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <button
        type="button"
        onClick={() => setCurrentSection(5)}
      >
        ← Previous
      </button>

      <button type="submit">
        Register Rider
      </button>
    </div>
  </>
)}
      
      </form>
      </div> 
  )}; 

export default Register;
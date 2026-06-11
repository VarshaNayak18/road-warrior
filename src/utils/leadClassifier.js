export function getLeadTypes(
  formData
) {
  const leads = [];

  if (
    formData.evInterest === "Yes"
  ) {
    leads.push("EV_SALE_LEAD");
  }

  if (
    formData.interestedServices.includes(
      "EV Rental Offer"
    )
  ) {
    leads.push("EV_RENTAL_LEAD");
  }

  if (
    formData.interestedServices.includes(
      "Retrofit Information"
    )
  ) {
    leads.push("RETROFIT_LEAD");
  }

  if (
    formData.healthInsurance ===
    "No"
  ) {
    leads.push(
      "PERSONAL_INSURANCE_LEAD"
    );
  }

  if (
    formData.accidentalInsurance ===
    "No"
  ) {
    leads.push(
      "BIKE_INSURANCE_LEAD"
    );
  }

  if (
    formData.productInterest
      ?.length > 0
  ) {
    leads.push(
      "PRODUCT_LEAD"
    );
  }

  return leads;
}
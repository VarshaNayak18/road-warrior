import { supabase } from "../lib/supabase";

export async function testConnection() {
  const { data, error } = await supabase
    .from("riders")
    .select("*");

  console.log(data);
  console.log(error);
}

export async function registerRider(rider) {
  const { data, error } = await supabase
    .from("riders")
    .insert([rider])
    .select();

  return { data, error };
}

export async function getAllRiders() {
  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .order("id", { ascending: false });

  return { data, error };
}

export async function findRiderByReferralCode(code) {
  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .eq("referral_code", code)
    .single();

  return { data, error };
}

export async function updateReferrer(referrer) {
  const newReferralCount =
    (referrer.referral_count || 0) + 1;

  let bonusPoints = 0;

  if (newReferralCount === 10) {
    bonusPoints = 100;
  }

  if (newReferralCount === 25) {
    bonusPoints = 300;
  }

  if (newReferralCount === 50) {
    bonusPoints = 500;
  }

  const totalPoints =
    referrer.points + 5 + bonusPoints;

  const { data, error } = await supabase
    .from("riders")
    .update({
      points: totalPoints,
      referral_count: newReferralCount,
    })
    .eq("id", referrer.id)
    .select()
    .single();

  return {
    data,
    error,
    milestone:
      newReferralCount === 10 ||
      newReferralCount === 25 ||
      newReferralCount === 50,
  };
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .order("points", {
      ascending: false,
    });

  return { data, error };
}

export async function getAnalytics() {
  const { data, error } = await supabase
    .from("riders")
    .select("*");

  return { data, error };
}

export async function getRiderByPhone(phone) {
  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .eq("phone", phone)
    .single();

  return { data, error };
}

export async function updateFollowUp(
  id,
  currentValue
) {
  const { data, error } =
    await supabase
      .from("riders")
      .update({
        follow_up: !currentValue,
      })
      .eq("id", id);

  return { data, error };
}
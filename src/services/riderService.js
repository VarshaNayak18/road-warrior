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

  let newPoints = referrer.points + 5;
  let newReferralCount =
    referrer.referral_count + 1;

  if (newReferralCount === 10) {
    newPoints += 100;
  }

  if (newReferralCount === 25) {
    newPoints += 300;
  }

  if (newReferralCount === 50) {
    newPoints += 500;
  }

  const { data, error } = await supabase
    .from("riders")
    .update({
      points: newPoints,
      referral_count: newReferralCount,
    })
    .eq("id", referrer.id);

  return { data, error };
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
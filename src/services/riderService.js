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
  const { data, error } = await supabase
    .from("riders")
    .update({
      points: referrer.points + 5,
      referral_count:
        referrer.referral_count + 1,
    })
    .eq("id", referrer.id);

  return { data, error };
}
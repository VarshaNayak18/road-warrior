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
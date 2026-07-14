"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signInWithOAuth(provider: "google" | "azure") {
  const supabase = await createClient();

  // Redirect url to our callback
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/auth/callback`,
      // For Microsoft Azure AD, request email and profile along with offline_access
      scopes: provider === "azure" ? "openid profile email offline_access" : undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }

  return { error: "Impossible de générer l'URL de connexion." };
}

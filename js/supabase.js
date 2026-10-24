
(async () => {
  try {
    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    const {
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    } = await import("./config.js");

    window.tichaSupabase = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    window.tichaSupabaseReady = true;
    console.log("Ticha Supabase initialized.");
  } catch (error) {
    window.tichaSupabaseReady = false;
    console.error("Ticha Supabase initialization failed:", error);
  }
})();



(async () => {
  try {
    const {
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    } = await import("./config.js");

    if (!window.supabase?.createClient) {
      throw new Error("Supabase library did not load.");
    }

    window.tichaSupabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    window.tichaSupabaseReady = true;

    console.log("Ticha Supabase connection initialized.");
  } catch (error) {
    window.tichaSupabaseReady = false;
    console.error("Ticha Supabase initialization failed:", error);
  }
})();

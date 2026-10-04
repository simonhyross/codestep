/* Public configuration. Safe to commit: the anon key is designed to be public and
   is only as powerful as the Row Level Security rules in supabase/schema.sql allow.
   NEVER put the service_role key here.
   Leave both empty to run in guest-only mode (no accounts). See SETUP.md. */
window.PYTHONIC_CONFIG = {
  supabaseUrl: "",       // e.g. "https://abcdxyzcompany.supabase.co"
  supabaseAnonKey: "",   // the project's "anon public" API key
};

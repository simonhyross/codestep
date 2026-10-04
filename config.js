/* Public configuration. Safe to commit: the anon key is designed to be public and
   is only as powerful as the Row Level Security rules in supabase/schema.sql allow.
   NEVER put the service_role key here.
   Leave both empty to run in guest-only mode (no accounts). See SETUP.md. */
window.PYTHONIC_CONFIG = {
  supabaseUrl: "https://reemmlgaedzevcqduweg.supabase.co",
  supabaseAnonKey: "sb_publishable_P1sZELxeHCrm3WMy5RWvEw_9JGhLBc4",   // publishable (public) key; safe to commit
};

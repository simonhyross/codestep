/* Interface translations. Lessons, Python error messages and linter messages stay in English.
   Missing keys fall back to English. Lists are "|" separated. {name} placeholders are interpolated. */
(() => {
const en = {
  review_upcoming: "Coming up", review_today_short: "Today",
  viz_title: "Watch it run", viz_tracing: "Tracing your code…", viz_step: "Step {n} of {total}", viz_frames: "Frames", viz_objects: "Objects", viz_output: "Output", viz_global: "Global frame",
  viz_play: "Play", viz_pause: "Pause", viz_prev: "Previous step", viz_next: "Next step", viz_first: "First step", viz_last: "Last step", viz_speed: "Speed",
  viz_truncated: "Stopped after {n} steps to keep things fast.", viz_start: "Press → or ▶ to step through your code.", viz_next_line: "Next up: line {n}",
  viz_created: "{name} is created: {value}", viz_changed: "{name} changed: {old} → {new}", viz_changed_obj: "{name} was modified: {value}", viz_called: "Called {name}()", viz_returned: "{name}() returned {value}",
  viz_unchanged: "Nothing changed yet.", viz_end: "The program finished.", viz_empty_vars: "no variables yet", viz_empty_objs: "no objects yet", viz_visualize: "Visualize", viz_keys: "← → step · Space play · Esc close", viz_more: "+{n} more", viz_error_title: "This code can't run yet",
  predict_kicker: "Predict", predict_q: "What will this print?", predict_placeholder: "Type the exact output…", predict_hint: "One line per print. Think it through before you check.", predict_right: "Spot on!", predict_wrong: "Not quite. Watch it run to see why.", predict_watch: "Watch it run", predict_answer: "It prints:",
  nav_review: "Review", review_title: "Daily review", review_due_one: "{n} review due", review_due_other: "{n} reviews due", review_none: "Nothing due. You're all caught up!", review_start: "Start review", review_practice: "Practice weak spots",
  review_hint: "Quick refreshers bring old lessons back right before you'd forget them.", review_done_title: "Review complete!", review_reviewed: "Reviewed", review_accuracy: "Correct", review_next: "Next review: {when}", review_tomorrow: "tomorrow", review_in_days: "in {n} days", review_today: "later today",
  review_kicker: "Review", review_empty: "Finish a lesson to unlock reviews.", review_stats: "{mastered} mastered · {learning} learning", review_mastered: "Mastered", review_learning: "Learning",
  err_username: "That username isn't available.", err_cooldown: "You can change your username once every 7 days.",
  nav_learn: "Learn", nav_playground: "Playground", nav_leaderboard: "Leaderboard", nav_profile: "Profile",
  sign_in: "Sign in", sign_out: "Sign out", create_account: "Create account", guest: "Guest",
  path_title: "Your learning path", streak: "Day streak", total_xp: "Total XP", level: "Level", xp: "XP",
  start: "START", start_lesson: "Start lesson", practice_again: "Practice again", unlock_msg: "Finish {title} to unlock this lesson.",
  n_steps: "{n} steps", n_min: "~{n} min", unit_n: "Unit {n}",
  mini_project: "Mini project", mini_projects: "Mini projects", all_levels: "All difficulties", filter_level: "Show by difficulty",
  project_badge: "Project", youll_learn: "What you will learn", close: "Close", any_order: "any order",
  needs_x: "Needs {title}", done_lbl: "Done", up_next: "UP NEXT", k_open: "Ready", k_done: "Done", k_locked: "Locked", k_level: "Difficulty",
  tier_n: "Step {n}", tier_any: "Pick any of these {n}, in any order", tier_one: "Next skill", path_goal: "YOUR GOAL", goal_progress: "{done} of {total} skills on the way",
  daily_goal: "Daily goal", goal_reached: "Goal reached!", xp_to_go: "{n} XP to go", goal_text: "Earn {n} XP every day to keep your streak alive.",
  level_line: "Level {n} · {name}", lessons_done: "{done} / {total} lessons complete", this_week: "This week", weekdays: "SMTWTFS",
  level_names: "Hatchling|Scripter|Coder|Debugger|Hacker|Architect|Wizard|Guru|Legend",
  mascot_streak: "{n}-day streak. Nice!", mascot_more: "Keep it going with one more lesson.", mascot_hi: "Hi, I'm Bit!", mascot_guide: "I'll be your guide. Pick a lesson to begin.",
  mascot_welcome: "Welcome back, {name}!", mascot_ready: "Ready for today's lesson?",
  say_learn: "Here's the key idea. Read it, then you'll try it!|Short and sweet. Then it's your turn.|Take your time. I'll be here when you're ready.|This part unlocks the next challenge!",
  say_quiz: "Which one do you think it is?|Take a guess. Mistakes help you learn!|Think it through, you've got this.|Trust your gut, then check!",
  say_code: "You can do this!|Break it into small steps.|Run early and often. It's free!|Stuck? Peek at the hint.",
  quick_check: "Quick check", challenge: "Challenge", cont: "Continue", check: "Check", try_again: "Try again", hint: "Hint", reset: "Reset", run: "Run",
  show_solution: "Show solution", hint_from: "Hint from Bit:", press_choose: "Press {a}–{b} to choose · {k} to check", to_continue: "{k} to continue",
  correct: "Correct!", not_quite: "Not quite", correct_answer: "Correct answer: {a}", brilliant: "Brilliant!", all_tests: "All tests passed.",
  look_again: "Have another look and try again.", too_long: "Your code ran too long. Check for infinite loops or a slower-than-needed algorithm.",
  has_error: "Your code has an error. See the output panel.", not_right: "Not quite right yet.",
  quit_title: "Quit this lesson?", quit_text: "Your progress in this lesson will be lost.", keep_going: "Keep going", quit: "Quit",
  sol_loaded: "Solution loaded. Read it, then press Check.", lesson_complete: "Lesson complete!", practice_complete: "Practice complete!", next_up: "Next up: {t}",
  xp_earned: "XP earned", first_try: "First-try", back_to_path: "Back to path", finish: "Finish",
  playground: "Playground", examples: "Examples…", copy: "Copy", clear: "Clear", run_profile: "Run + Profile", run_profile_tip: "Run and measure time and peak memory",
  copied: "Copied to clipboard", copy_fail: "Couldn't copy", no_problems: "No problems", n_errors_one: "{n} error", n_errors_other: "{n} errors",
  n_sugg_one: "{n} suggestion", n_sugg_other: "{n} suggestions", ln_col: "Ln {l}, Col {c}",
  output: "Output", problems: "Problems", press_run: "Press {b} ({k}+Enter) and I'll show your output here.", running: "Running…",
  warming: "Warming up Python (first load takes a few seconds)…", stopped: "Stopped", stopped_text: "your code ran for more than {n} seconds.",
  stopped_hint: "Look for an infinite loop (a while whose condition never becomes false) or a very slow algorithm.", no_output: "(no output)",
  clean_code: "No problems found. Clean code!", line_n: "line {n}", peak: "peak {m}",
  py_ready: "Python 3.12 ready", py_loading: "Loading Python…", py_failed: "Python failed to load", py_failed_tip: "Check your internet connection. Python (Pyodide) is downloaded from a CDN.",
  done: "Done", cancel: "Cancel", save: "Save", saved: "Saved", retry: "Retry", back: "Back", loading: "Loading…",

  /* auth */
  auth_title_in: "Welcome back", auth_title_up: "Create your account",
  auth_sub_in: "Sign in to save your progress and join the leaderboard.", auth_sub_up: "Save your progress, climb the leaderboard and keep your streak on any device.",
  email: "Email", password: "Password", username: "Username", show: "Show", hide: "Hide", continue_google: "Continue with Google", or: "or",
  forgot: "Forgot password?", no_account: "New here?", have_account: "Already have an account?",
  pw_hint: "At least 10 characters. Longer is stronger.", pw_weak: "Weak", pw_ok: "Okay", pw_strong: "Strong",
  pw_too_short: "Use at least 10 characters.", pw_common: "That password is too common.", pw_personal: "Don't use your email or username in the password.",
  pw_variety: "Mix letters, numbers or symbols, or make it longer.",
  user_rules: "3–20 letters, numbers or underscores.", user_taken: "That username is taken or not allowed.", user_free: "Available", user_checking: "Checking…",
  check_inbox: "Check your inbox", check_inbox_text: "We sent a confirmation link to {email}. Open it to finish creating your account.",
  resend: "Resend email", resent: "Email sent",
  reset_title: "Reset your password", reset_text: "Enter your email and we'll send you a link to choose a new password.", send_link: "Send reset link",
  reset_sent: "If an account exists for that email, a reset link is on its way.", new_password: "New password", set_password: "Set new password", pw_updated: "Password updated.",
  
  err_invalid: "Wrong email or password.", err_unconfirmed: "Please confirm your email first. Check your inbox.", err_rate: "Too many attempts. Please wait a minute and try again.",
  err_weak: "That password isn't strong enough.", err_generic: "Something went wrong. Please try again.", err_network: "Can't reach the server. Check your connection.",
  err_email: "Enter a valid email address.", err_reauth: "For security, please sign in again and retry.",
  signed_out: "Signed out", not_configured: "Accounts aren't enabled on this site yet.",
  choose_username: "Choose your username", choose_username_text: "This is how you'll appear on the leaderboard. You can change it later (once every 7 days).",
  imported: "Your progress from this device was added to your account.", demo_banner: "Demo mode: accounts are simulated in this browser only.",

  /* settings */
  settings_title: "Settings", sec_profile: "Profile", sec_prefs: "Preferences", sec_notif: "Notifications", sec_security: "Security", sec_data: "Your data", sec_learning: "Learning",
  avatar: "Profile picture", choose_preset: "Pick an avatar", upload_photo: "Upload photo", remove_photo: "Remove photo",
  photo_hint: "JPG, PNG or WebP. We resize it to 256×256 and strip location data.", photo_err: "Choose an image file under 5 MB.",
  display_name: "Display name", display_name_hint: "Optional. Shown on your profile.", username_note: "Shown on the leaderboard. Changeable once every 7 days.",
  language: "Language", language_note: "Changes the app's interface. Lessons stay in English.",
  theme: "Theme", theme_system: "System", theme_light: "Light", theme_dark: "Dark", goal_label: "Daily goal", goal_xp: "{n} XP",
  show_lb: "Show me on the leaderboard", show_lb_note: "When off, others can't see you. You still see your own rank.",
  email_notif: "Weekly summary email", email_notif_note: "A short recap of your week every Monday.",
  reminders: "Daily practice reminder", reminders_note: "One email if you haven't practised yet today.", remind_time: "Reminder time", timezone: "Time zone",
  notif_note: "You can unsubscribe at any time from any email.",
  change_pw: "Change password", 
  
  
  signout_all: "Sign out everywhere", signout_all_note: "Ends all sessions, including other devices.", providers: "Sign-in methods",
  export_data: "Download my data", export_note: "A JSON file with your profile and progress.",
  delete_account: "Delete account", delete_note: "Permanently deletes your account, progress and leaderboard entries. This can't be undone.",
  delete_confirm_title: "Delete your account?", delete_confirm_text: "Type your username ({u}) to confirm.", deleted_toast: "Your account was deleted.",
  unlock_all: "Unlock all lessons", unlock_all_note: "Jump to any lesson without finishing the previous ones.",
  reset_progress: "Reset progress", reset_note: "Erase XP, streak and completed lessons on this device.", reset_confirm: "Reset all progress?", cant_undo: "This can't be undone.", progress_reset: "Progress reset",
  guest_banner_title: "You're learning as a guest", guest_banner_text: "Create a free account to save your progress, join the leaderboard and get practice reminders.",
  member_since: "Member since {d}",

  /* leaderboard */
  lb_title: "Leaderboard", lb_week: "This week", lb_all: "All time", lb_resets: "Resets in {t}", lb_empty: "No one is on the board yet. Finish a lesson to take first place!",
  lb_you: "You", lb_signin_title: "Sign in to see the leaderboard", lb_signin_text: "Create a free account to compete with other learners and track your rank.",
  lb_error: "Couldn't load the leaderboard.", lb_hidden: "You're hidden from the leaderboard. Only you can see this row.",
};

const DICTS = { en };
const NAMES = { en: "English" };
let lang = "en";

function t(key, vars) {
  let s = (DICTS[lang] && DICTS[lang][key]) ?? en[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return s;
}
const tn = (key, n) => t(key + (n === 1 ? "_one" : "_other"), { n });
const list = key => t(key).split("|");

window.I18N = {
  t, tn, list, NAMES, LANGS: Object.keys(DICTS),
  get lang() { return lang; },
  setLang(l) {
    lang = DICTS[l] ? l : "en";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-title]").forEach(el => el.setAttribute("title", t(el.dataset.i18nTitle)));
    return lang;
  },
  detect() {
    const l = (navigator.language || "en").slice(0, 2).toLowerCase();
    return DICTS[l] ? l : "en";
  },
};
})();

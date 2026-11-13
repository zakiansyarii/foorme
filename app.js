const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const toast = document.querySelector("#toast");
const API_PATH = "/api/gym";
const DEFAULT_SITE_CONTENT = {
  brandName: "FORME",
  heroEyebrow: "Ruang untuk jadi lebih kuat",
  heroTitle: "Lebih dari",
  heroHighlight: "latihan.",
  heroDescription: "Temukan ritmemu, catat setiap progres, dan bangun versi dirimu yang lebih kuat — satu sesi dalam satu waktu.",
  communityText: "Komunitas yang bertumbuh bersama.",
  loginEyebrow: "Selamat datang kembali",
  loginTitle: "Masuk ke ruangmu.",
  loginDescription: "Lanjutkan progres latihanmu dari tempat terakhir.",
  signupEyebrow: "Mulai perjalananmu",
  signupTitle: "Buat akunmu.",
  signupDescription: "Profil latihanmu akan tersimpan aman dan bisa kamu akses kapan saja.",
  dataNote: "Data akun dan progres latihanmu tersimpan pribadi di Google Sheets.",
  navOverview: "Ringkasan",
  navWorkouts: "Latihan",
  navClasses: "Kelas",
  navNutrition: "Nutrisi",
  navProfile: "Profil",
  navAdmin: "Admin",
  dashboardEyebrow: "Senang melihatmu lagi",
  dashboardGreeting: "Hai,",
  dashboardSubtitle: "siap bergerak hari ini?",
  featureEyebrow: "Sesi pilihan hari ini",
  featureTitle: "Small steps.",
  featureTitleSecond: "Stronger every day.",
  featureDescription: "Mulai dari latihan yang terasa pas untukmu.",
  weeklyTitle: "Ritme mingguan",
  weeklySubtitle: "Menit latihanmu selama 7 hari terakhir",
  activityTitle: "Aktivitas terbaru",
  activitySubtitle: "Semua langkahmu tetap berarti",
  todayClassesTitle: "Kelas hari ini",
  todayClassesSubtitle: "Pilih sesi yang cocok untukmu",
  workoutsEyebrow: "Ruang latihanmu",
  workoutsTitle: "Pilih program.",
  workoutsSubtitle: "Mulai dari sesi yang terasa pas untuk energi hari ini.",
  classesEyebrow: "Gerak bersama",
  classesTitle: "Kelas pilihanmu.",
  classesSubtitle: "Jadwal kelas hari ini — reservasi sesi yang paling cocok.",
  nutritionEyebrow: "Rawat dirimu",
  nutritionTitle: "Nutrisi harian.",
  nutritionSubtitle: "Catat asupanmu dengan sederhana, tanpa harus mengejar sempurna.",
  profileEyebrow: "Akun dan preferensi",
  profileTitle: "Ruang pribadimu.",
  profileSubtitle: "Informasi ini membantu kami menyesuaikan pengalaman latihanmu.",
  programUpperTitle: "Upper body strength",
  programUpperDescription: "Bangun kekuatan tubuh bagian atas dengan gerakan compound.",
  programLowerTitle: "Lower body power",
  programLowerDescription: "Latihan kaki dan glute untuk tenaga yang lebih stabil.",
  programFullTitle: "Full body reset",
  programFullDescription: "Sesi seluruh tubuh untuk hari yang padat tapi tetap aktif.",
  classStrengthTitle: "Strength Lab",
  classStrengthCoach: "Coach Dimas · 45 menit",
  classMobilityTitle: "Mobility Flow",
  classMobilityCoach: "Coach Naya · 40 menit",
  classBoxingTitle: "Boxing Circuit",
  classBoxingCoach: "Coach Raka · 50 menit",
  classHiitTitle: "HIIT Session",
  classHiitCoach: "Coach Sari · 35 menit",
};
const CMS_GROUPS = [
  {
    title: "Halaman masuk",
    fields: [
      ["brandName", "Nama brand"], ["heroEyebrow", "Label hero"], ["heroTitle", "Judul hero"],
      ["heroHighlight", "Sorotan judul"], ["heroDescription", "Deskripsi hero", true],
      ["communityText", "Teks komunitas"], ["loginEyebrow", "Label login"],
      ["loginTitle", "Judul login"], ["loginDescription", "Deskripsi login", true],
      ["signupEyebrow", "Label registrasi"], ["signupTitle", "Judul registrasi"],
      ["signupDescription", "Deskripsi registrasi", true], ["dataNote", "Catatan privasi", true],
    ],
  },
  {
    title: "Navigasi dan dashboard",
    fields: [
      ["navOverview", "Menu ringkasan"], ["navWorkouts", "Menu latihan"], ["navClasses", "Menu kelas"],
      ["navNutrition", "Menu nutrisi"], ["navProfile", "Menu profil"], ["navAdmin", "Menu admin"],
      ["dashboardEyebrow", "Sapaan dashboard"], ["dashboardGreeting", "Awalan nama anggota"], ["dashboardSubtitle", "Subjudul dashboard"],
      ["featureEyebrow", "Label sesi pilihan"], ["featureTitle", "Judul sesi baris 1"],
      ["featureTitleSecond", "Judul sesi baris 2"], ["featureDescription", "Deskripsi sesi pilihan", true],
      ["weeklyTitle", "Judul progres mingguan"], ["weeklySubtitle", "Deskripsi progres mingguan", true],
      ["activityTitle", "Judul aktivitas"], ["activitySubtitle", "Deskripsi aktivitas", true],
      ["todayClassesTitle", "Judul kelas dashboard"], ["todayClassesSubtitle", "Deskripsi kelas dashboard", true],
    ],
  },
  {
    title: "Halaman utama",
    fields: [
      ["workoutsEyebrow", "Label halaman latihan"], ["workoutsTitle", "Judul halaman latihan"],
      ["workoutsSubtitle", "Deskripsi halaman latihan", true], ["classesEyebrow", "Label halaman kelas"],
      ["classesTitle", "Judul halaman kelas"], ["classesSubtitle", "Deskripsi halaman kelas", true],
      ["nutritionEyebrow", "Label halaman nutrisi"], ["nutritionTitle", "Judul halaman nutrisi"],
      ["nutritionSubtitle", "Deskripsi halaman nutrisi", true], ["profileEyebrow", "Label halaman profil"],
      ["profileTitle", "Judul halaman profil"], ["profileSubtitle", "Deskripsi halaman profil", true],
    ],
  },
  {
    title: "Program latihan dan kelas",
    fields: [
      ["programUpperTitle", "Nama program upper body"], ["programUpperDescription", "Deskripsi program upper body", true],
      ["programLowerTitle", "Nama program lower body"], ["programLowerDescription", "Deskripsi program lower body", true],
      ["programFullTitle", "Nama program full body"], ["programFullDescription", "Deskripsi program full body", true],
      ["classStrengthTitle", "Nama kelas Strength Lab"], ["classStrengthCoach", "Pelatih dan durasi Strength Lab"],
      ["classMobilityTitle", "Nama kelas Mobility Flow"], ["classMobilityCoach", "Pelatih dan durasi Mobility Flow"],
      ["classBoxingTitle", "Nama kelas Boxing Circuit"], ["classBoxingCoach", "Pelatih dan durasi Boxing Circuit"],
      ["classHiitTitle", "Nama kelas HIIT"], ["classHiitCoach", "Pelatih dan durasi HIIT"],
    ],
  },
];
const CLASS_SCHEDULE = [
  { id: "strength", time: "07:00", titleKey: "classStrengthTitle", coachKey: "classStrengthCoach", icon: "↗" },
  { id: "mobility", time: "09:30", titleKey: "classMobilityTitle", coachKey: "classMobilityCoach", icon: "◌" },
  { id: "boxing", time: "16:00", titleKey: "classBoxingTitle", coachKey: "classBoxingCoach", icon: "◈" },
  { id: "hiit", time: "18:30", titleKey: "classHiitTitle", coachKey: "classHiitCoach", icon: "ϟ" },
];
const PROGRAMS = [
  { id: "upper", titleKey: "programUpperTitle", detailKey: "programUpperDescription", meta: "6 gerakan", duration: "45 menit", icon: "◈", minutes: 45, calories: 320 },
  { id: "lower", titleKey: "programLowerTitle", detailKey: "programLowerDescription", meta: "5 gerakan", duration: "50 menit", icon: "↗", minutes: 50, calories: 380 },
  { id: "full", titleKey: "programFullTitle", detailKey: "programFullDescription", meta: "7 gerakan", duration: "35 menit", icon: "ϟ", minutes: 35, calories: 280 },
];
let state = { user: null, token: null, page: "overview", activities: [], content: { ...DEFAULT_SITE_CONTENT }, adminUsers: [], adminTab: "content", authMode: "login", toastTimer: null };

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function greetingName() {
  return (state.user?.name || "Atlet").trim().split(/\s+/)[0];
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

function initials(name = "A") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

function text(key) {
  return escapeHtml(state.content[key] ?? DEFAULT_SITE_CONTENT[key] ?? "");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

async function request(action, payload = {}) {
  const response = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, token: state.token, ...payload }),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Respons server tidak valid. Periksa konfigurasi API Vercel dan Apps Script.");
  }
  if (!response.ok || !result.success) throw new Error(result.message || "Permintaan belum berhasil. Coba lagi.");
  return result.data;
}

function errorText(error) {
  if (error instanceof TypeError) return "Tidak dapat menghubungi server. Pastikan API Vercel dan Apps Script sudah dikonfigurasi.";
  return error.message || "Terjadi kendala. Coba beberapa saat lagi.";
}

function showAuth(mode = "login", error = "") {
  state.authMode = mode;
  const register = mode === "register";
  app.innerHTML = `
    <section class="auth-screen">
      <div class="auth-visual">
        <div class="brand"><span class="brand-mark">f</span> ${text("brandName")}</div>
        <div class="visual-copy">
          <span class="eyebrow">${text("heroEyebrow")}</span>
          <h1>${text("heroTitle")}<br/><span>${text("heroHighlight")}</span></h1>
          <p>${text("heroDescription")}</p>
        </div>
        <div class="visual-foot">
          <div class="avatar-stack" aria-hidden="true"><span>R</span><span>A</span><span>D</span><span>N</span></div>
          <span>${text("communityText")}</span>
        </div>
      </div>
      <div class="auth-panel">
        <div class="auth-card">
          <div class="brand auth-mobile-brand"><span class="brand-mark">f</span> ${text("brandName")}</div>
          <span class="eyebrow">${text(register ? "signupEyebrow" : "loginEyebrow")}</span>
          <h2>${text(register ? "signupTitle" : "loginTitle")}</h2>
          <p class="auth-intro">${text(register ? "signupDescription" : "loginDescription")}</p>
          <div class="auth-tabs" role="tablist" aria-label="Pilih cara masuk">
            <button type="button" class="auth-tab ${!register ? "active" : ""}" data-auth-mode="login">Masuk</button>
            <button type="button" class="auth-tab ${register ? "active" : ""}" data-auth-mode="register">Buat akun</button>
          </div>
          <form id="auth-form" novalidate>
            ${register ? `<div class="field"><label for="auth-name">Nama lengkap</label><input id="auth-name" name="name" autocomplete="name" placeholder="Contoh: Nadia Putri" required maxlength="70" /></div>` : ""}
            <div class="field"><label for="auth-username">Username</label><input id="auth-username" name="username" autocomplete="username" placeholder="${register ? "Contoh: nadia.fit" : "Masukkan username"}" required minlength="3" maxlength="30" /></div>
            ${register ? `<div class="field"><small>Gunakan 3–30 karakter: huruf, angka, titik, garis bawah, atau tanda hubung.</small></div>` : ""}
            <div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" placeholder="${register ? "Minimal 10 karakter" : "Masukkan password"}" required minlength="${register ? "10" : "1"}" maxlength="128" /></div>
            ${register ? `<div class="field"><label for="auth-goal">Fokus latihan</label><select id="auth-goal" name="goal"><option>Membangun otot</option><option>Menurunkan berat badan</option><option>Menjaga kebugaran</option><option>Meningkatkan stamina</option></select></div>` : ""}
            <div id="auth-error" class="form-error ${error ? "visible" : ""}" role="alert">${escapeHtml(error)}</div>
            <button class="primary-btn auth-submit" type="submit">${register ? "Buat akun gratis <span>→</span>" : "Masuk ke dashboard <span>→</span>"}</button>
          </form>
          <p class="auth-note">${text("dataNote")}</p>
        </div>
      </div>
    </section>`;
}

function navButton(id, icon, label) {
  return `<button type="button" class="nav-item ${state.page === id ? "active" : ""}" data-page="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`;
}

function todayActivities() {
  const today = new Date().toDateString();
  return state.activities.filter((item) => new Date(item.createdAt).toDateString() === today);
}

function weeklyMinutes() {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  return state.activities.reduce((total, item) => {
    if (item.type !== "workout" || new Date(item.createdAt) < since) return total;
    return total + (Number(item.payload?.minutes) || 0);
  }, 0);
}

function weekChart() {
  const days = [];
  const today = new Date();
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const amount = state.activities.reduce((sum, item) => {
      if (item.type !== "workout" || new Date(item.createdAt).toDateString() !== date.toDateString()) return sum;
      return sum + (Number(item.payload?.minutes) || 0);
    }, 0);
    days.push({ label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date).slice(0, 2), amount, today: offset === 0 });
  }
  const max = Math.max(50, ...days.map((day) => day.amount));
  return days.map((day) => `<div class="chart-day ${day.today ? "today" : ""}" title="${day.amount} menit"><div class="chart-track"><div class="chart-bar" style="height:${Math.max(day.amount ? 10 : 4, day.amount / max * 100)}%"></div></div><span>${escapeHtml(day.label)}</span></div>`).join("");
}

function activityRows() {
  const recent = state.activities.slice(0, 4);
  if (!recent.length) return `<div class="empty-state">Belum ada aktivitas. Mulai sesi pertamamu hari ini.</div>`;
  return recent.map((item) => {
    const payload = item.payload || {};
    const title = payload.title || payload.name || (item.type === "booking" ? "Kelas gym" : "Catatan nutrisi");
    const detail = item.type === "workout" ? `${payload.minutes || 0} menit · ${payload.calories || 0} kkal` : item.type === "booking" ? "Kelas berhasil dipesan" : `${payload.calories || 0} kkal`;
    const icon = item.type === "workout" ? "↗" : item.type === "booking" ? "◈" : "＋";
    return `<div class="activity-row"><div class="activity-symbol">${icon}</div><div class="activity-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div><span class="activity-trailing">${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.createdAt))}</span></div>`;
  }).join("");
}

function miniClasses() {
  const booked = new Set(todayActivities().filter((item) => item.type === "booking").map((item) => item.payload?.classId));
  return CLASS_SCHEDULE.slice(0, 3).map((item) => `<div class="class-row"><span class="class-time">${item.time}</span><div class="class-copy"><strong>${text(item.titleKey)}</strong><span>${text(item.coachKey).split(" · ")[0]}</span></div><button class="class-book ${booked.has(item.id) ? "booked" : ""}" type="button" data-book-class="${item.id}">${booked.has(item.id) ? "Terdaftar" : "Ikut"}</button></div>`).join("");
}

function dashboardPage() {
  const page = state.page;
  if (page === "admin" && state.user.isAdmin) return renderAdmin();
  if (page === "workouts") return renderWorkouts();
  if (page === "classes") return renderClasses();
  if (page === "nutrition") return renderNutrition();
  if (page === "profile") return renderProfile();
  const user = state.user;
  const sessions = todayActivities().filter((item) => item.type === "workout").length;
  return `
    <div class="welcome-row">
      <div><span class="eyebrow">${text("dashboardEyebrow")}</span><h1>${text("dashboardGreeting")} ${escapeHtml(greetingName())} <span>✦</span></h1><p>${formatDate()} · ${text("dashboardSubtitle")}</p></div>
      <button class="primary-btn" type="button" data-action="start-workout">＋ Catat latihan</button>
    </div>
    <section class="stats-grid" aria-label="Ringkasan progres">
      <article class="stat-card"><div class="stat-top"><span>Menit latihan · 7 hari</span><span class="stat-icon">◷</span></div><div class="stat-value">${weeklyMinutes()}<small>menit</small></div><div class="stat-foot">Terus jaga ritmemu</div></article>
      <article class="stat-card"><div class="stat-top"><span>Sesi hari ini</span><span class="stat-icon">↗</span></div><div class="stat-value">${sessions}<small>sesi</small></div><div class="stat-foot">${sessions ? "Progresmu tercatat hari ini" : "Satu sesi kecil berarti"}</div></article>
      <article class="stat-card"><div class="stat-top"><span>Berat badan</span><span class="stat-icon">⌁</span></div><div class="stat-value">${Number(user.weightKg) > 0 ? escapeHtml(user.weightKg) : "—"}<small>kg</small></div><div class="stat-foot">Perbarui dari profilmu</div></article>
      <article class="stat-card"><div class="stat-top"><span>Fokus minggu ini</span><span class="stat-icon">◎</span></div><div class="stat-value">${escapeHtml((user.goal || "Kebugaran").split(" ")[0])}</div><div class="stat-foot">Langkah demi langkah</div></article>
    </section>
    <section class="content-grid">
      <div class="left-stack">
        <article class="workout-feature"><div class="workout-info"><span class="eyebrow">${text("featureEyebrow")}</span><h2>${text("featureTitle")}<br/>${text("featureTitleSecond")}</h2><p>${text("featureDescription")}</p><div class="workout-meta"><span>◷ 35–50 menit</span><span>◈ Semua level</span></div></div><div class="workout-action"><button class="primary-btn" type="button" data-page="workouts">Lihat program →</button></div></article>
        <article class="panel"><div class="panel-head"><div><h2 class="panel-title">${text("weeklyTitle")}</h2><p class="panel-subtitle">${text("weeklySubtitle")}</p></div><span class="eyebrow">7 hari</span></div><div class="week-chart">${weekChart()}</div></article>
        <article class="panel"><div class="panel-head"><div><h2 class="panel-title">${text("activityTitle")}</h2><p class="panel-subtitle">${text("activitySubtitle")}</p></div><button class="text-btn" type="button" data-page="workouts">Lihat latihan →</button></div><div class="activity-list">${activityRows()}</div></article>
      </div>
      <div class="right-stack">
        <article class="membership-card"><div class="member-top"><span>Anggota · ${text("brandName")}</span><span class="member-status">AKTIF</span></div><div class="member-name">${escapeHtml(user.name || "Anggota")}</div><div class="member-email">@${escapeHtml(user.username || "")}</div><div class="member-bottom"><span>Member sejak</span><span>${user.createdAt ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(new Date(user.createdAt)) : "Hari ini"}</span></div></article>
        <article class="panel"><div class="panel-head"><div><h2 class="panel-title">${text("todayClassesTitle")}</h2><p class="panel-subtitle">${text("todayClassesSubtitle")}</p></div><button class="text-btn" type="button" data-page="classes">Semua →</button></div><div class="class-list">${miniClasses()}</div></article>
        <article class="sidebar-card"><span class="eyebrow">Ingat ini</span><strong>Konsisten, bukan sempurna.</strong><p>Setiap kali kamu datang, kamu sudah selangkah lebih dekat.</p></article>
      </div>
    </section>`;
}

function renderWorkouts() {
  return `<div class="page-heading"><span class="eyebrow">${text("workoutsEyebrow")}</span><h1>${text("workoutsTitle")}</h1><p>${text("workoutsSubtitle")}</p></div><div class="program-grid">${PROGRAMS.map((program) => `<article class="program-card"><div class="program-art"><span>${program.icon}</span></div><div class="program-body"><h3>${text(program.titleKey)}</h3><p>${text(program.detailKey)}</p><div class="program-stats"><span>${program.meta}</span><span>${program.duration}</span></div><button class="primary-btn" type="button" data-log-program="${program.id}">Catat latihan →</button></div></article>`).join("")}</div><article class="panel" style="margin-top:16px"><div class="panel-head"><div><h2 class="panel-title">Riwayat aktivitas</h2><p class="panel-subtitle">Progres latihan yang tersimpan di profilmu</p></div></div><div class="activity-list">${activityRows()}</div></article>`;
}

function renderClasses() {
  const booked = new Set(todayActivities().filter((item) => item.type === "booking").map((item) => item.payload?.classId));
  const bookings = todayActivities().filter((item) => item.type === "booking");
  return `<div class="page-heading"><span class="eyebrow">${text("classesEyebrow")}</span><h1>${text("classesTitle")}</h1><p>${text("classesSubtitle")}</p></div><div class="class-page-grid">${CLASS_SCHEDULE.map((item) => `<article class="class-card"><div class="class-card-icon">${item.icon}</div><div class="class-card-copy"><span class="eyebrow">${item.time} · HARI INI</span><h3>${text(item.titleKey)}</h3><p>${text(item.coachKey)}</p></div><button class="secondary-btn ${booked.has(item.id) ? "lime" : ""}" type="button" data-book-class="${item.id}">${booked.has(item.id) ? "✓ Terdaftar" : "Daftar"}</button></article>`).join("")}</div><article class="panel" style="margin-top:16px"><div class="panel-head"><div><h2 class="panel-title">Kelas yang kamu ikuti</h2><p class="panel-subtitle">Reservasi hari ini</p></div></div><div class="activity-list">${bookings.length ? activityRowsForBookings(bookings) : `<div class="empty-state">Belum ada kelas yang kamu ikuti hari ini.</div>`}</div></article>`;
}

function activityRowsForBookings(items) {
  return items.map((item) => `<div class="activity-row"><div class="activity-symbol">◈</div><div class="activity-copy"><strong>${escapeHtml(item.payload?.title || "Kelas gym")}</strong><span>Reservasi hari ini · ${escapeHtml(item.payload?.time || "")}</span></div><span class="activity-trailing">Terdaftar</span></div>`).join("");
}

function renderNutrition() {
  const meals = todayActivities().filter((item) => item.type === "nutrition");
  const calories = meals.reduce((sum, item) => sum + (Number(item.payload?.calories) || 0), 0);
  const target = 2000;
  const percent = Math.min(100, Math.round(calories / target * 100));
  return `<div class="page-heading"><span class="eyebrow">${text("nutritionEyebrow")}</span><h1>${text("nutritionTitle")}</h1><p>${text("nutritionSubtitle")}</p></div><section class="nutrition-summary"><article class="nutrition-total"><div class="calorie-ring" style="background:radial-gradient(circle closest-side,#191a16 83%,transparent 84%),conic-gradient(var(--lime) ${percent}%, #35372f 0)"><div><strong>${calories.toLocaleString("id-ID")}</strong><span>kkal hari ini</span></div></div><div class="nutrition-copy"><span class="eyebrow">Progres harian</span><h2>${percent >= 100 ? "Target tercapai." : "Satu pilihan sehat lagi."}</h2><p>Perkiraan target harian <strong class="lime">${target.toLocaleString("id-ID")} kkal</strong>. Angka ini hanya panduan, kebutuhan setiap orang berbeda.</p></div></article><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Ringkasan hari ini</h2><p class="panel-subtitle">${meals.length} catatan tersimpan</p></div></div><div class="nutrition-list"><div class="nutrition-row"><span>Asupan tercatat</span><strong>${calories.toLocaleString("id-ID")} kkal</strong></div><div class="nutrition-row"><span>Sisa panduan</span><strong>${Math.max(0, target - calories).toLocaleString("id-ID")} kkal</strong></div></div><button class="primary-btn" style="width:100%;margin-top:18px" type="button" data-action="add-meal">＋ Catat asupan</button></article></section><article class="panel" style="margin-top:16px"><div class="panel-head"><div><h2 class="panel-title">Catatan asupan</h2><p class="panel-subtitle">Entri yang kamu tambahkan hari ini</p></div></div><div class="activity-list">${meals.length ? activityRowsFor(meals) : `<div class="empty-state">Belum ada catatan. Tambahkan asupan pertamamu.</div>`}</div></article>`;
}

function activityRowsFor(items) {
  return items.map((item) => `<div class="activity-row"><div class="activity-symbol">＋</div><div class="activity-copy"><strong>${escapeHtml(item.payload?.title || "Asupan")}</strong><span>Catatan nutrisi</span></div><span class="activity-trailing">${Number(item.payload?.calories || 0).toLocaleString("id-ID")} kkal</span></div>`).join("");
}

function renderProfile() {
  const user = state.user;
  return `<div class="page-heading"><span class="eyebrow">${text("profileEyebrow")}</span><h1>${text("profileTitle")}</h1><p>${text("profileSubtitle")}</p></div><div class="profile-grid"><article class="panel"><div class="profile-card"><div class="user-avatar">${escapeHtml(initials(user.name))}</div><div><h2>${escapeHtml(user.name)}</h2><p>@${escapeHtml(user.username)}</p></div></div><form id="profile-form"><div class="profile-details"><div class="field wide"><label for="profile-name">Nama lengkap</label><input id="profile-name" name="name" value="${escapeHtml(user.name || "")}" maxlength="70" required /></div><div class="field wide"><label for="profile-goal">Fokus latihan</label><select id="profile-goal" name="goal">${["Membangun otot", "Menurunkan berat badan", "Menjaga kebugaran", "Meningkatkan stamina"].map((item) => `<option ${user.goal === item ? "selected" : ""}>${item}</option>`).join("")}</select></div><div class="field"><label for="profile-weight">Berat badan (kg)</label><input id="profile-weight" name="weightKg" type="number" min="25" max="350" step="0.1" value="${escapeHtml(user.weightKg || "")}" placeholder="Contoh: 64" /></div><div class="field"><label for="profile-height">Tinggi badan (cm)</label><input id="profile-height" name="heightCm" type="number" min="100" max="250" step="1" value="${escapeHtml(user.heightCm || "")}" placeholder="Contoh: 168" /></div></div><button class="primary-btn" type="submit">Simpan profil →</button></form></article><article class="panel"><span class="eyebrow">Keanggotaan</span><h2 class="panel-title" style="margin-top:9px">${escapeHtml(user.level || "Member")} ${text("brandName")}</h2><p class="muted" style="font-size:11px;line-height:1.7">Semua progres dan catatan aktivitasmu terhubung ke akun ini dan tersimpan di Google Sheets.</p><div class="nutrition-list" style="margin-top:22px"><div class="nutrition-row"><span>Status akun</span><strong class="lime">Aktif</strong></div><div class="nutrition-row"><span>Username</span><strong>@${escapeHtml(user.username)}</strong></div><div class="nutrition-row"><span>Member sejak</span><strong>${user.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(user.createdAt)) : "Hari ini"}</strong></div></div><button class="secondary-btn" style="width:100%;margin-top:22px" type="button" data-action="logout">Keluar dari akun</button></article></div>`;
}

function renderAdmin() {
  const activeTab = state.adminTab;
  const tabs = `<div class="admin-tabs"><button type="button" class="admin-tab ${activeTab === "content" ? "active" : ""}" data-admin-tab="content">✎ Konten website</button><button type="button" class="admin-tab ${activeTab === "users" ? "active" : ""}" data-admin-tab="users">◎ Pengguna</button></div>`;
  const contentForm = `<form id="site-content-form">${CMS_GROUPS.map((group, index) => `<details class="admin-section" ${index === 0 ? "open" : ""}><summary>${group.title}</summary><div class="admin-fields">${group.fields.map(([key, label, multiline]) => `<div class="field"><label for="content-${key}">${label}</label>${multiline ? `<textarea id="content-${key}" name="${key}" rows="3" maxlength="500">${escapeHtml(state.content[key] || "")}</textarea>` : `<input id="content-${key}" name="${key}" value="${escapeHtml(state.content[key] || "")}" maxlength="500" />`}</div>`).join("")}</div></details>`).join("")}<div class="admin-save-row"><span>Perubahan ditampilkan untuk seluruh anggota.</span><button class="primary-btn" type="submit">Simpan teks website →</button></div></form>`;
  return `<div class="page-heading"><span class="eyebrow">Pengelolaan website</span><h1>Panel admin.</h1><p>Atur konten yang terlihat anggota dan kelola akses akun.</p></div>${tabs}${activeTab === "content" ? contentForm : renderAdminUsers()}`;
}

function renderAdminUsers() {
  if (!state.adminUsers.length) return `<div class="panel admin-empty"><div class="empty-state">Belum ada akun anggota untuk ditampilkan.</div></div>`;
  return `<section class="admin-user-list">${state.adminUsers.map((user) => {
    const active = user.status === "active";
    return `<article class="panel admin-user-card"><div class="admin-user-identity"><div class="user-avatar">${escapeHtml(initials(user.name))}</div><div><strong>${escapeHtml(user.name)}</strong><span>@${escapeHtml(user.username)}${user.isAdmin ? " · Admin" : ""}</span></div></div><div class="admin-user-meta"><span class="admin-status ${active ? "active" : "disabled"}">${active ? "Aktif" : "Nonaktif"}</span><span>${escapeHtml(user.goal || "Fokus belum diatur")}</span><span>${user.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(user.createdAt)) : "—"}</span></div><div class="admin-user-actions"><button class="secondary-btn" type="button" data-edit-user="${escapeHtml(user.id)}">Edit profil</button><button class="${active ? "danger-btn" : "secondary-btn"}" type="button" data-toggle-user="${escapeHtml(user.id)}" ${user.id === state.user.id ? "disabled title=\"Tidak dapat menonaktifkan akun sendiri\"" : ""}>${active ? "Nonaktifkan" : "Aktifkan"}</button></div></article>`;
  }).join("")}</section>`;
}

function renderDashboard() {
  const pageLabels = { overview: text("navOverview"), workouts: text("navWorkouts"), classes: text("navClasses"), nutrition: text("navNutrition"), profile: text("navProfile"), admin: text("navAdmin") };
  const navigation = `${navButton("overview", "⌂", text("navOverview"))}${navButton("workouts", "↗", text("navWorkouts"))}${navButton("classes", "◈", text("navClasses"))}${navButton("nutrition", "＋", text("navNutrition"))}${navButton("profile", "◎", text("navProfile"))}${state.user.isAdmin ? navButton("admin", "⚙", text("navAdmin")) : ""}`;
  app.innerHTML = `<div class="dashboard-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">f</span> ${text("brandName")}</div><p class="side-label">Menu utama</p><nav class="nav-list" aria-label="Navigasi utama">${navigation}</nav><div class="sidebar-spacer"></div><article class="sidebar-card"><span class="eyebrow">Ingat ini</span><strong>Konsisten, bukan sempurna.</strong><p>Setiap kali kamu datang, kamu sudah selangkah lebih dekat.</p></article><div class="user-mini"><div class="user-avatar">${escapeHtml(initials(state.user.name))}</div><div class="user-mini-copy"><strong>${escapeHtml(state.user.name)}</strong><span>${state.user.isAdmin ? "Administrator" : `Member ${text("brandName")}`}</span></div><button class="icon-btn" type="button" data-action="logout" aria-label="Keluar">↗</button></div></aside><section class="main-area"><header class="topbar"><div class="breadcrumb"><strong>${text("brandName")}</strong><span> / ${pageLabels[state.page] || text("navOverview")}</span></div><div class="topbar-right"><span class="date-pill">${formatDate()}</span><button class="icon-btn mobile-menu" type="button" data-page="profile" aria-label="Profil">◎</button><button class="user-avatar" style="cursor:pointer" type="button" data-page="profile" aria-label="Buka profil">${escapeHtml(initials(state.user.name))}</button></div></header><main class="page-wrap">${dashboardPage()}</main></section></div>`;
}

async function loadDashboard() {
  const data = await request("getData");
  state.user = data.user;
  state.activities = Array.isArray(data.activities) ? data.activities : [];
  state.content = { ...DEFAULT_SITE_CONTENT, ...(data.content || {}) };
  renderDashboard();
}

async function loadAdminUsers() {
  try {
    const data = await request("adminListUsers");
    state.adminUsers = data.users || [];
    renderDashboard();
  } catch (error) {
    showToast(errorText(error));
  }
}

async function startSession(data) {
  state.token = data.token;
  state.user = data.user;
  sessionStorage.setItem("forme-token", data.token);
  state.page = "overview";
  try {
    await loadDashboard();
  } catch (error) {
    sessionStorage.removeItem("forme-token");
    state.token = null;
    state.user = null;
    throw error;
  }
}

function openModal(title, subtitle, content) {
  modal.innerHTML = `<div class="modal-head"><div><h2>${title}</h2><p>${subtitle}</p></div><button type="button" class="icon-btn" data-close-modal aria-label="Tutup">×</button></div>${content}`;
  modal.showModal();
}

function openWorkoutModal(program = null) {
  const selected = program || PROGRAMS[0];
  openModal("Catat latihan", "Aktivitas ini akan masuk ke progres akunmu.", `<form id="workout-form"><div class="field"><label for="workout-title">Nama latihan</label><input id="workout-title" name="title" value="${text(selected.titleKey)}" maxlength="80" required /></div><div class="field-grid"><div class="field"><label for="workout-minutes">Durasi (menit)</label><input id="workout-minutes" name="minutes" type="number" min="1" max="600" value="${selected.minutes}" required /></div><div class="field"><label for="workout-calories">Kalori (kkal)</label><input id="workout-calories" name="calories" type="number" min="0" max="5000" value="${selected.calories}" required /></div></div><div class="modal-actions"><button type="button" class="secondary-btn" data-close-modal>Batal</button><button class="primary-btn" type="submit">Simpan latihan</button></div></form>`);
}

function openNutritionModal() {
  openModal("Catat asupan", "Estimasi sederhana untuk membantumu lebih sadar.", `<form id="nutrition-form"><div class="field"><label for="meal-title">Nama makanan / minuman</label><input id="meal-title" name="title" placeholder="Contoh: Sarapan setelah latihan" maxlength="80" required /></div><div class="field"><label for="meal-calories">Perkiraan kalori (kkal)</label><input id="meal-calories" name="calories" type="number" min="1" max="10000" placeholder="Contoh: 450" required /></div><div class="modal-actions"><button type="button" class="secondary-btn" data-close-modal>Batal</button><button class="primary-btn" type="submit">Simpan catatan</button></div></form>`);
}

function openAdminUserModal(userId) {
  const user = state.adminUsers.find((item) => item.id === userId);
  if (!user) return;
  const goals = ["Membangun otot", "Menurunkan berat badan", "Menjaga kebugaran", "Meningkatkan stamina"];
  openModal("Edit anggota", `Perbarui profil @${escapeHtml(user.username)}.`, `<form id="admin-user-form" data-user-id="${escapeHtml(user.id)}"><div class="field"><label for="admin-user-name">Nama lengkap</label><input id="admin-user-name" name="name" value="${escapeHtml(user.name)}" maxlength="70" required /></div><div class="field"><label for="admin-user-goal">Fokus latihan</label><select id="admin-user-goal" name="goal">${goals.map((goal) => `<option ${user.goal === goal ? "selected" : ""}>${goal}</option>`).join("")}</select></div><div class="field-grid"><div class="field"><label for="admin-user-weight">Berat (kg)</label><input id="admin-user-weight" name="weightKg" type="number" min="25" max="350" step="0.1" value="${escapeHtml(user.weightKg || "")}" /></div><div class="field"><label for="admin-user-height">Tinggi (cm)</label><input id="admin-user-height" name="heightCm" type="number" min="100" max="250" step="1" value="${escapeHtml(user.heightCm || "")}" /></div></div><div class="modal-actions"><button type="button" class="secondary-btn" data-close-modal>Batal</button><button class="primary-btn" type="submit">Simpan profil</button></div></form>`);
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.authMode) { showAuth(target.dataset.authMode); return; }
  if (target.hasAttribute("data-close-modal")) { modal.close(); return; }
  if (target.dataset.page) {
    if (target.dataset.page === "admin" && !state.user.isAdmin) return;
    state.page = target.dataset.page;
    renderDashboard();
    return;
  }
  if (target.dataset.adminTab) {
    state.adminTab = target.dataset.adminTab;
    renderDashboard();
    if (state.adminTab === "users") await loadAdminUsers();
    return;
  }
  if (target.dataset.editUser) { openAdminUserModal(target.dataset.editUser); return; }
  if (target.dataset.toggleUser) {
    const user = state.adminUsers.find((item) => item.id === target.dataset.toggleUser);
    if (!user || user.id === state.user.id) return;
    target.disabled = true;
    try {
      const nextStatus = user.status === "active" ? "disabled" : "active";
      await request("adminSetUserStatus", { userId: user.id, status: nextStatus });
      await loadAdminUsers();
      showToast(nextStatus === "active" ? "Akun anggota diaktifkan." : "Akun anggota dinonaktifkan.");
    } catch (error) {
      target.disabled = false;
      showToast(errorText(error));
    }
    return;
  }
  if (target.dataset.action === "logout") { sessionStorage.removeItem("forme-token"); state = { ...state, user: null, token: null, activities: [], page: "overview" }; showAuth("login"); return; }
  if (target.dataset.action === "start-workout") { openWorkoutModal(); return; }
  if (target.dataset.action === "add-meal") { openNutritionModal(); return; }
  if (target.dataset.logProgram) { openWorkoutModal(PROGRAMS.find((item) => item.id === target.dataset.logProgram)); return; }
  if (target.dataset.bookClass) {
    const classInfo = CLASS_SCHEDULE.find((item) => item.id === target.dataset.bookClass);
    if (!classInfo) return;
    target.disabled = true;
    try {
      const classTitle = state.content[classInfo.titleKey] || DEFAULT_SITE_CONTENT[classInfo.titleKey];
      await request("bookClass", { classId: classInfo.id, title: classTitle, time: classInfo.time });
      await loadDashboard();
      showToast(`Kamu terdaftar untuk ${classTitle}.`);
    } catch (error) {
      target.disabled = false;
      showToast(errorText(error));
    }
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  if (form.id === "auth-form") {
    const errorBox = document.querySelector("#auth-error");
    errorBox.classList.remove("visible");
    try {
      const action = state.authMode === "register" ? "register" : "login";
      const data = await request(action, values);
      await startSession(data);
    } catch (error) {
      errorBox.textContent = errorText(error);
      errorBox.classList.add("visible");
      if (submitButton) submitButton.disabled = false;
    }
    return;
  }
  try {
    if (form.id === "workout-form") {
      await request("logWorkout", { workout: { ...values, minutes: Number(values.minutes), calories: Number(values.calories) } });
      modal.close();
      await loadDashboard();
      showToast("Latihan tersimpan. Progresmu terus bertumbuh.");
    } else if (form.id === "nutrition-form") {
      await request("logNutrition", { meal: { ...values, calories: Number(values.calories) } });
      modal.close();
      await loadDashboard();
      showToast("Catatan asupan berhasil disimpan.");
    } else if (form.id === "profile-form") {
      const data = await request("updateProfile", { profile: { ...values, weightKg: values.weightKg ? Number(values.weightKg) : "", heightCm: values.heightCm ? Number(values.heightCm) : "" } });
      state.user = data.user;
      renderDashboard();
      showToast("Profilmu berhasil diperbarui.");
    } else if (form.id === "site-content-form") {
      const data = await request("adminUpdateSiteContent", { content: values });
      state.content = { ...DEFAULT_SITE_CONTENT, ...data.content };
      renderDashboard();
      showToast("Teks website berhasil diperbarui.");
    } else if (form.id === "admin-user-form") {
      const data = await request("adminUpdateUser", {
        userId: form.dataset.userId,
        profile: { ...values, weightKg: values.weightKg ? Number(values.weightKg) : "", heightCm: values.heightCm ? Number(values.heightCm) : "" },
      });
      if (form.dataset.userId === state.user.id) state.user = data.user;
      modal.close();
      await loadAdminUsers();
      showToast("Profil anggota berhasil diperbarui.");
    }
  } catch (error) {
    showToast(errorText(error));
    if (submitButton) submitButton.disabled = false;
  }
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

async function boot() {
  const token = sessionStorage.getItem("forme-token");
  let contentError = "";
  if (!token) showAuth();
  try {
    const data = await request("getSiteContent");
    state.content = { ...DEFAULT_SITE_CONTENT, ...(data.content || {}) };
  } catch (error) {
    contentError = errorText(error);
  }
  if (!token) {
    const hasTypedInput = Array.from(app.querySelectorAll("#auth-form input")).some((input) => input.value);
    if (!hasTypedInput) showAuth(state.authMode, contentError);
    return;
  }
  state.token = token;
  try {
    await loadDashboard();
  } catch (error) {
    sessionStorage.removeItem("forme-token");
    state.token = null;
    showAuth("login", errorText(error));
  }
}

boot();

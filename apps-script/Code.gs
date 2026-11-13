const USERS_SHEET = "Users";
const ACTIVITY_SHEET = "Activities";
const CONTENT_SHEET = "SiteContent";
const PASSWORD_ITERATIONS = 12000;
const SESSION_TTL_SECONDS = 21600;

function setup() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  let spreadsheet;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create("FORME — Data Anggota Gym");
    properties.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  }
  ensureSheet_(spreadsheet, USERS_SHEET, ["id", "name", "username", "passwordHash", "salt", "goal", "weightKg", "heightCm", "level", "createdAt", "status"]);
  ensureSheet_(spreadsheet, ACTIVITY_SHEET, ["id", "userId", "type", "payloadJson", "createdAt"]);
  ensureSheet_(spreadsheet, CONTENT_SHEET, ["key", "value", "updatedAt"]);
  ensureUserStatusColumn_(spreadsheet.getSheetByName(USERS_SHEET));
  seedSiteContent_(spreadsheet.getSheetByName(CONTENT_SHEET));
  console.log("FORME spreadsheet: " + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doGet() {
  return jsonOutput_({ success: true, message: "FORME API siap." });
}

function doPost(event) {
  try {
    const input = JSON.parse(event.postData.contents || "{}");
    const data = routeRequest_(input);
    return jsonOutput_({ success: true, data: data });
  } catch (error) {
    return jsonOutput_({ success: false, message: error.message || "Permintaan tidak dapat diproses." });
  }
}

function routeRequest_(input) {
  switch (input.action) {
    case "register": return register_(input);
    case "login": return login_(input);
    case "getSiteContent": return { content: readSiteContent_() };
    case "getData": return getData_(requireUser_(input.token));
    case "updateProfile": return updateProfile_(requireUser_(input.token), input.profile || {});
    case "logWorkout": return addActivity_(requireUser_(input.token), "workout", input.workout || {});
    case "bookClass": return addActivity_(requireUser_(input.token), "booking", { classId: input.classId, title: input.title, time: input.time });
    case "logNutrition": return addActivity_(requireUser_(input.token), "nutrition", input.meal || {});
    case "adminListUsers": return listUsers_(requireAdmin_(input.token));
    case "adminUpdateUser": return updateUserAsAdmin_(requireAdmin_(input.token), input.userId, input.profile || {});
    case "adminSetUserStatus": return setUserStatus_(requireAdmin_(input.token), input.userId, input.status);
    case "adminUpdateSiteContent": return updateSiteContent_(requireAdmin_(input.token), input.content || {});
    default: throw new Error("Aksi tidak dikenali.");
  }
}

function register_(input) {
  const name = cleanText_(input.name, 70);
  const username = normalizeUsername_(input.username);
  const password = String(input.password || "");
  const goals = ["Membangun otot", "Menurunkan berat badan", "Menjaga kebugaran", "Meningkatkan stamina"];
  if (name.length < 2) throw new Error("Nama lengkap minimal 2 karakter.");
  if (!isValidUsername_(username)) throw new Error("Username harus 3–30 karakter dan hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda hubung.");
  if (password.length < 10 || password.length > 128) throw new Error("Password harus terdiri dari 10–128 karakter.");
  const goal = goals.indexOf(input.goal) >= 0 ? input.goal : goals[0];
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_(USERS_SHEET);
    const rows = sheet.getDataRange().getValues();
    for (let index = 1; index < rows.length; index++) {
      if (String(rows[index][2]).toLowerCase() === username) throw new Error("Username ini sudah digunakan. Silakan pilih username lain.");
    }
    const salt = Utilities.getUuid() + Utilities.getUuid();
    const user = {
      id: Utilities.getUuid(),
      name: name,
      username: username,
      passwordHash: derivePassword_(password, salt),
      salt: salt,
      goal: goal,
      weightKg: "",
      heightCm: "",
      level: "Member",
      createdAt: new Date().toISOString(),
      status: "active"
    };
    sheet.appendRow([user.id, user.name, user.username, user.passwordHash, user.salt, user.goal, "", "", user.level, user.createdAt, user.status]);
    return createSession_(user);
  } finally {
    lock.releaseLock();
  }
}

function login_(input) {
  const username = normalizeUsername_(input.username);
  const password = String(input.password || "");
  if (!isValidUsername_(username) || !password) throw new Error("Username atau password tidak tepat.");
  const rows = getSheet_(USERS_SHEET).getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];
    if (String(row[2]).toLowerCase() !== username) continue;
    const candidate = derivePassword_(password, String(row[4]));
    if (!constantTimeEqual_(candidate, String(row[3]))) throw new Error("Username atau password tidak tepat.");
    const user = userFromRow_(row);
    if (user.status !== "active") throw new Error("Akun ini sedang dinonaktifkan. Hubungi admin gym.");
    return createSession_(user);
  }
  throw new Error("Username atau password tidak tepat.");
}

function getData_(userId) {
  const users = getSheet_(USERS_SHEET).getDataRange().getValues();
  let user = null;
  for (let index = 1; index < users.length; index++) {
    if (String(users[index][0]) === userId) {
      user = publicUser_(userFromRow_(users[index]));
      break;
    }
  }
  if (!user) throw new Error("Akun tidak ditemukan. Silakan masuk kembali.");
  const rows = getSheet_(ACTIVITY_SHEET).getDataRange().getValues();
  const activities = [];
  for (let index = rows.length - 1; index > 0 && activities.length < 100; index--) {
    const row = rows[index];
    if (String(row[1]) !== userId) continue;
    activities.push({ id: row[0], type: row[2], payload: JSON.parse(row[3]), createdAt: row[4] });
  }
  return { user: user, activities: activities, content: readSiteContent_() };
}

function updateProfile_(userId, profile) {
  const name = cleanText_(profile.name, 70);
  const goals = ["Membangun otot", "Menurunkan berat badan", "Menjaga kebugaran", "Meningkatkan stamina"];
  if (name.length < 2) throw new Error("Nama lengkap minimal 2 karakter.");
  if (goals.indexOf(profile.goal) < 0) throw new Error("Pilih fokus latihan yang tersedia.");
  const weight = optionalNumber_(profile.weightKg, 25, 350, "Berat badan");
  const height = optionalNumber_(profile.heightCm, 100, 250, "Tinggi badan");
  const sheet = getSheet_(USERS_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    if (String(rows[index][0]) !== userId) continue;
    sheet.getRange(index + 1, 2, 1, 1).setValue(name);
    sheet.getRange(index + 1, 6, 1, 3).setValues([[profile.goal, weight, height]]);
    return { user: publicUser_({ id: rows[index][0], name: name, username: rows[index][2], goal: profile.goal, weightKg: weight, heightCm: height, level: rows[index][8], createdAt: rows[index][9] }) };
  }
  throw new Error("Akun tidak ditemukan.");
}

function addActivity_(userId, type, payload) {
  let safePayload;
  if (type === "workout") {
    const title = cleanText_(payload.title, 80);
    const minutes = requiredNumber_(payload.minutes, 1, 600, "Durasi");
    const calories = requiredNumber_(payload.calories, 0, 5000, "Kalori");
    if (!title) throw new Error("Nama latihan wajib diisi.");
    safePayload = { title: title, minutes: minutes, calories: calories };
  } else if (type === "booking") {
    const title = cleanText_(payload.title, 80);
    const classId = cleanText_(payload.classId, 40);
    const time = cleanText_(payload.time, 10);
    if (!title || !classId || !time) throw new Error("Informasi kelas tidak lengkap.");
    const sheet = getSheet_(ACTIVITY_SHEET);
    const rows = sheet.getDataRange().getValues();
    for (let index = 1; index < rows.length; index++) {
      if (String(rows[index][1]) !== userId || rows[index][2] !== "booking") continue;
      const existing = JSON.parse(rows[index][3]);
      if (existing.classId === classId && new Date(rows[index][4]).toDateString() === new Date().toDateString()) {
        throw new Error("Kamu sudah terdaftar untuk kelas ini hari ini.");
      }
    }
    safePayload = { title: title, classId: classId, time: time };
  } else {
    const title = cleanText_(payload.title, 80);
    const calories = requiredNumber_(payload.calories, 1, 10000, "Kalori");
    if (!title) throw new Error("Nama makanan atau minuman wajib diisi.");
    safePayload = { title: title, calories: calories };
  }
  getSheet_(ACTIVITY_SHEET).appendRow([Utilities.getUuid(), userId, type, JSON.stringify(safePayload), new Date().toISOString()]);
  return { saved: true };
}

function createSession_(user) {
  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("session:" + token, user.id, SESSION_TTL_SECONDS);
  return { token: token, user: publicUser_(user) };
}

function requireUser_(token) {
  const userId = CacheService.getScriptCache().get("session:" + String(token || ""));
  if (!userId) throw new Error("Sesi berakhir. Silakan masuk kembali.");
  const user = findUserById_(userId);
  if (!user || user.status !== "active") throw new Error("Akun tidak aktif atau sesi berakhir. Silakan masuk kembali.");
  return userId;
}

function requireAdmin_(token) {
  const userId = requireUser_(token);
  const user = findUserById_(userId);
  if (!user || !isAdminUsername_(user.username)) throw new Error("Akses admin diperlukan.");
  return userId;
}

function listUsers_(adminId) {
  const rows = getSheet_(USERS_SHEET).getDataRange().getValues();
  const users = [];
  for (let index = 1; index < rows.length; index++) {
    if (!rows[index][0]) continue;
    users.push(publicUser_(userFromRow_(rows[index])));
  }
  return { users: users, adminId: adminId };
}

function updateUserAsAdmin_(adminId, userId, profile) {
  const targetId = String(userId || "");
  const name = cleanText_(profile.name, 70);
  const goals = ["Membangun otot", "Menurunkan berat badan", "Menjaga kebugaran", "Meningkatkan stamina"];
  if (!targetId || name.length < 2) throw new Error("Pilih akun dan isi nama lengkap dengan benar.");
  if (goals.indexOf(profile.goal) < 0) throw new Error("Pilih fokus latihan yang tersedia.");
  const weight = optionalNumber_(profile.weightKg, 25, 350, "Berat badan");
  const height = optionalNumber_(profile.heightCm, 100, 250, "Tinggi badan");
  const sheet = getSheet_(USERS_SHEET);
  const rows = sheet.getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    if (String(rows[index][0]) !== targetId) continue;
    sheet.getRange(index + 1, 2, 1, 1).setValue(name);
    sheet.getRange(index + 1, 6, 1, 3).setValues([[profile.goal, weight, height]]);
    return { user: publicUser_(userFromRow_(sheet.getRange(index + 1, 1, 1, 11).getValues()[0])) };
  }
  throw new Error("Akun yang dipilih tidak ditemukan.");
}

function setUserStatus_(adminId, userId, status) {
  const targetId = String(userId || "");
  if (!targetId || (status !== "active" && status !== "disabled")) throw new Error("Status akun tidak valid.");
  if (targetId === adminId && status !== "active") throw new Error("Admin tidak dapat menonaktifkan akunnya sendiri.");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_(USERS_SHEET);
    const rows = sheet.getDataRange().getValues();
    for (let index = 1; index < rows.length; index++) {
      if (String(rows[index][0]) !== targetId) continue;
      sheet.getRange(index + 1, 11).setValue(status);
      return { userId: targetId, status: status };
    }
    throw new Error("Akun yang dipilih tidak ditemukan.");
  } finally {
    lock.releaseLock();
  }
}

function updateSiteContent_(adminId, updates) {
  const defaults = defaultSiteContent_();
  const sheet = getSheet_(CONTENT_SHEET);
  const rows = sheet.getDataRange().getValues();
  const rowByKey = {};
  for (let index = 1; index < rows.length; index++) rowByKey[String(rows[index][0])] = index + 1;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    Object.keys(updates).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
      const value = cleanText_(updates[key], 500);
      const row = rowByKey[key];
      if (row) {
        sheet.getRange(row, 2, 1, 2).setValues([[value, new Date().toISOString()]]);
      } else {
        sheet.appendRow([key, value, new Date().toISOString()]);
      }
    });
  } finally {
    lock.releaseLock();
  }
  return { content: readSiteContent_() };
}

function readSiteContent_() {
  const content = defaultSiteContent_();
  const rows = getSheet_(CONTENT_SHEET).getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    const key = String(rows[index][0]);
    if (Object.prototype.hasOwnProperty.call(content, key)) content[key] = String(rows[index][1] || "");
  }
  return content;
}

function defaultSiteContent_() {
  return {
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
    classHiitCoach: "Coach Sari · 35 menit"
  };
}

function ensureUserStatusColumn_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.indexOf("status") >= 0) return;
  const statusColumn = Math.max(10, sheet.getLastColumn()) + 1;
  sheet.getRange(1, statusColumn).setValue("status");
  if (sheet.getLastRow() > 1) sheet.getRange(2, statusColumn, sheet.getLastRow() - 1).setValue("active");
}

function seedSiteContent_(sheet) {
  const rows = sheet.getDataRange().getValues();
  const existing = {};
  for (let index = 1; index < rows.length; index++) existing[String(rows[index][0])] = true;
  const defaults = defaultSiteContent_();
  Object.keys(defaults).forEach(function (key) {
    if (!existing[key]) sheet.appendRow([key, defaults[key], new Date().toISOString()]);
  });
}

function findUserById_(userId) {
  const rows = getSheet_(USERS_SHEET).getDataRange().getValues();
  for (let index = 1; index < rows.length; index++) {
    if (String(rows[index][0]) === String(userId)) return userFromRow_(rows[index]);
  }
  return null;
}

function isAdminUsername_(username) {
  const configured = PropertiesService.getScriptProperties().getProperty("ADMIN_USERNAMES") || "";
  const names = configured.split(",").map(function (item) { return normalizeUsername_(item); }).filter(Boolean);
  return names.indexOf(normalizeUsername_(username)) >= 0;
}

function derivePassword_(password, salt) {
  const key = Utilities.newBlob(password).getBytes();
  const message = Utilities.newBlob(salt + String.fromCharCode(0, 0, 0, 1)).getBytes();
  let digest = Utilities.computeHmacSha256Signature(message, key);
  for (let index = 1; index < PASSWORD_ITERATIONS; index++) digest = Utilities.computeHmacSha256Signature(digest, key);
  return digest.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ("0" + value.toString(16)).slice(-2);
  }).join("");
}

function constantTimeEqual_(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function userFromRow_(row) {
  return { id: row[0], name: row[1], username: row[2], goal: row[5], weightKg: row[6], heightCm: row[7], level: row[8], createdAt: row[9], status: row[10] || "active" };
}

function publicUser_(user) {
  return { id: user.id, name: user.name, username: user.username, goal: user.goal, weightKg: user.weightKg, heightCm: user.heightCm, level: user.level, createdAt: user.createdAt, status: user.status || "active", isAdmin: isAdminUsername_(user.username) };
}

function getSheet_(name) {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Database belum disiapkan. Jalankan fungsi setup() di Apps Script.");
  const sheet = SpreadsheetApp.openById(id).getSheetByName(name);
  if (!sheet) throw new Error("Sheet " + name + " tidak ditemukan. Jalankan fungsi setup() kembali.");
  return sheet;
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function normalizeUsername_(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidUsername_(username) {
  return /^[a-z0-9._-]{3,30}$/.test(username);
}

function cleanText_(value, maxLength) {
  return String(value || "").trim().replace(/[<>]/g, "").slice(0, maxLength);
}

function requiredNumber_(value, min, max, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(label + " harus antara " + min + " dan " + max + ".");
  return number;
}

function optionalNumber_(value, min, max, label) {
  if (value === "" || value === null || typeof value === "undefined") return "";
  return requiredNumber_(value, min, max, label);
}

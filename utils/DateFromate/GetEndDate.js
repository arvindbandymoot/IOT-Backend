function calculateEndDate(plan) {
  const date = new Date();
  if (plan === "Monthly") date.setMonth(date.getMonth() + 1);
  if (plan === "Yearly") date.setFullYear(date.getFullYear() + 1);
  return date;
}
function utcToIST(utcTime) {
  if (!utcTime) return "00:00 AM";

  let [h, m, s] = utcTime.split(":").map(Number);

  // Add IST offset
  m += 30;
  h += 5;

  if (m >= 60) {
    m -= 60;
    h += 1;
  }

  h = h % 24;

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function utcToSeconds(utcTime) {
  const [h, m, s] = utcTime.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function calculateWorkTimeIST(inTime, outTime) {
  let diffMinutes =
    ampmToMinutes(outTime) - ampmToMinutes(inTime);

  // night shift / next day
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

function ampmToMinutes(time) {
  if (!time) return 0;

  // 🔥 remove quotes + normalize
  time = time.replace(/"/g, "").trim().toUpperCase();

  if (time === "00:00 AM" || time === "00:00 PM") return 0;

  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);

  if (!match) {
    console.error("Invalid time format:", time);
    return 0;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function calculateLateIn(actualIn, shiftIn) {
  const actualMinutes = ampmToMinutes(actualIn);
  const shiftMinutes = ampmToMinutes(shiftIn);

  const diff = actualMinutes - shiftMinutes;

  return diff > 0
    ? `${Math.floor(diff / 60)}:${(diff % 60).toString().padStart(2, "0")}`
    : "00:00";
}

function calculateEarlyOut(actualOut, shiftOut) {
  const diff = ampmToMinutes(shiftOut) - ampmToMinutes(actualOut);
  return diff > 0 ? `${Math.floor(diff / 60)}:${(diff % 60).toString().padStart(2, "0")}` : "00:00";
}

function calculateOverTime(actualOut, shiftOut) {
  const diff = ampmToMinutes(actualOut) - ampmToMinutes(shiftOut);
  return diff > 0 ? `${Math.floor(diff / 60)}:${(diff % 60).toString().padStart(2, "0")}` : "00:00";
}


module.exports = {calculateEndDate,utcToIST,calculateLateIn,calculateEarlyOut,calculateOverTime,calculateWorkTimeIST}
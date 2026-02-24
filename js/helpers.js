/***********************
 * HELPERS
 ***********************/
export function showToast(text, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = text;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 1600);
}

export function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

export function normalizePartyCode(code){
  return (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function randomPartyCode(len = 6){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for(let i=0;i<len;i++){
    out += chars[Math.floor(Math.random()*chars.length)];
  }
  return out;
}

export function setJoinStatus(text, isError=false){
  joinStatus.textContent = text || "";
  joinStatus.style.color = isError ? "#ff6b6b" : "#cfe9dc";
}

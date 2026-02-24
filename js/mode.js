import { modus, modusIcon } from "./state.js";
import { render, updateSpotifyWidget } from "./render.js";

/***********************
 * MODE / TITLE
 ***********************/
export function setModus(neu){
  modus = neu;
  document.querySelectorAll(".controls button").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + neu).classList.add("active");
  updateTitle();
  render();
}

export function updateTitle(){
  const base = `${modusIcon[modus]} SingStar Party`;
  const suffix = (window.partyCode ? ` (Party Code: ${window.partyCode})` : "");
  document.querySelector("header h1").textContent = base + suffix;
}

export function updateToggleLabels(musikDB){
  const songCount = musikDB.length;
  const interpretCount = new Set(musikDB.map(s => s.interpret)).size;
  const cdCount = new Set(musikDB.map(s => s.cd)).size;

  document.getElementById("btn-interpret").textContent = `🎤 Interpret (${interpretCount})`;
  document.getElementById("btn-cd").textContent = `💿 CD (${cdCount})`;
  document.getElementById("btn-song").textContent = `🔤 Song (${songCount})`;
}

/***********************
 * INIT
 ***********************/
import { placeSpotifyWidget, updateSpotifyWidget } from "./render.js";
import { loadMusikDB } from "./loader.js";
import { showView } from "./mobile.js";
import { openJoin } from "./join.js";
import { ensureAuth } from "./auth.js";
import { findOrCreatePartyByCode } from "./party.js";
import { loadQueueOnce, startPolling } from "./queue.js";
import { updateTitle } from "./mode.js";
import * as state from "./state.js";
import { joinNameInput, joinCodeInput } from "./dom.js";

document.addEventListener("DOMContentLoaded", async ()=>{

  placeSpotifyWidget();

  document
    .getElementById("settingsBtn")
    ?.addEventListener("click", ()=>openJoin());

  await loadMusikDB();

  if(window.innerWidth <= 768)
    showView("alleSongs");

  const storedName = localStorage.getItem("displayName");
  const storedCode = localStorage.getItem("partyCode");

  if(storedName) joinNameInput.value = storedName;
  if(storedCode) joinCodeInput.value = storedCode;

  if(storedName && storedCode){
    state.displayName = storedName;

    try{
      await ensureAuth();

      const party = await findOrCreatePartyByCode(storedCode);
      state.partyId = party.id;
      state.partyCode = party.code;

      await loadQueueOnce();
      startPolling();

    } catch(e){
      console.error(e);
      openJoin();
    }

  } else {
    openJoin();
  }

  updateSpotifyWidget();
  updateTitle();
});

window.addEventListener("resize", ()=>{
  placeSpotifyWidget();

  const active = document
    .querySelector(".bottom-nav button.active")
    ?.getAttribute("data-view");

  if(window.matchMedia("(max-width: 768px)").matches && active)
    showView(active);
});

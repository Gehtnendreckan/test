/***********************
 * JOIN / PARTY HANDLING
 ***********************/
async function doJoin({ createNew=false, adminEmail=null, adminPassword=null } = {}) {
  try {
    joinBtn.disabled = true;
    createBtn.disabled = true;
    setJoinStatus("Verbinde…");

    // Auth: Admin oder Guest
    await ensureAuth({ adminEmail, adminPassword });

    const name = (joinNameInput.value || "").trim();
    if(!name) throw new Error("Bitte deinen Namen eingeben.");

    displayName = name;
    localStorage.setItem("displayName", displayName);

    let code = normalizePartyCode(joinCodeInput.value);
    if(createNew){
      if(!isAdmin()) throw new Error("Nur Admins dürfen neue Partys erstellen.");
      code = randomPartyCode(6);
      joinCodeInput.value = code;
    }

    if(!code) throw new Error("Bitte Party-Code eingeben.");

    setJoinStatus("Party wird geladen…");
    const party = await findOrCreatePartyByCode(code);
    partyId = party.id;
    partyCode = party.code;

    localStorage.setItem("partyCode", partyCode);

    setJoinStatus(`✅ Joined: ${partyCode}`);
    closeJoin();

    // Queue laden + Polling starten
    await loadQueueOnce();
    startPolling();

  } catch(err) {
    console.error(err);
    setJoinStatus(err.message || "Join fehlgeschlagen.", true);
  } finally {
    joinBtn.disabled = false;
    createBtn.disabled = false;
  }
}

// Event-Handler
joinBtn.addEventListener("click", () => doJoin({ createNew:false }));
createBtn.addEventListener("click", () => doJoin({ createNew:true }));

/***********************
 * QUEUE (SUPABASE)
 ***********************/
import { supa } from "./supabase.js";
import { showToast } from "./helpers.js";
import { ensureAuth } from "./auth.js";
import { createSongItem } from "./render.js";
import * as state from "./state.js";

/***********************
 * ADD
 ***********************/
export async function addToQueue(song){
  if(!state.partyId){
    const { openJoin } = await import("./join.js");
    openJoin();
    return;
  }

  try{
    await ensureAuth();

    const payload = {
      party_id: state.partyId,
      song_id: song.spotifyId,
      song: song.song,
      interpret: song.interpret,
      cd: song.cd || "",
      added_by: state.currentUserId,
      added_by_name: state.displayName || "?"
    };

    const { error } = await supa.from("queue_items").insert(payload);

    if(error){
      console.error(error);
      alert("Konnte nicht zur Queue hinzufügen.");
      return;
    }

    showToast("Zur Liste hinzugefügt", "success");

    if(song.spotifyId){
      const { playSpotify } = await import("./render.js");
      playSpotify(song.spotifyId);
    }

    await loadQueueOnce();

  } catch(e){
    console.error(e);
    alert("Fehler beim Hinzufügen.");
  }
}

/***********************
 * DELETE
 ***********************/
export async function deleteQueueItem(itemId){
  try{
    await ensureAuth();

    const { error } = await supa
      .from("queue_items")
      .delete()
      .eq("id", itemId);

    if(error){
      console.error(error);
      alert("Du kannst nur deine eigenen Einträge löschen.");
      return;
    }

    showToast("Gelöscht", "delete");

    await loadQueueOnce();

  } catch(e){
    console.error(e);
    alert("Fehler beim Löschen.");
  }
}

/***********************
 * LOAD ONCE
 ***********************/
export async function loadQueueOnce(){
  if(!state.partyId) return;

  const { data, error } = await supa
    .from("queue_items")
    .select("id, party_id, song_id, song, interpret, cd, added_by, added_by_name, created_at")
    .eq("party_id", state.partyId)
    .order("created_at", { ascending: true });

  if(error){
    console.error(error);
    return;
  }

  renderQueueFromDb(data || []);
}

/***********************
 * RENDER QUEUE
 ***********************/
export function renderQueueFromDb(items){
  const queueContainer =
    document.querySelector(".right-panel.queue-view #auswahlListe");

  if(!queueContainer) return;

  queueContainer.innerHTML = "";
  state.auswahlMap.clear();

  const byCd = new Map();

  for(const it of items){
    const cd = it.cd || "";
    if(!byCd.has(cd)) byCd.set(cd, []);
    byCd.get(cd).push(it);
  }

  const cdOrder = Array.from(byCd.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(entry => entry[0]);

  for(const cd of cdOrder){
    const groupItems = byCd.get(cd) || [];

    const group = document.createElement("div");
    group.className = "cd-group";

    const header = document.createElement("div");
    header.className = "cd-header";

    const shownName = cd ? `💿 ${cd}` : "💿 (ohne CD)";
    header.innerHTML = `<span>${shownName}</span>`;
    group.appendChild(header);

    const ul = document.createElement("ul");
    ul.className = "song-list-ul";

    groupItems.forEach((it, idx)=>{
      const songObj = {
        song: it.song,
        interpret: it.interpret,
        cd: it.cd,
        spotifyId: it.song_id
      };

      const li = createSongItem(songObj, false);
      li.setAttribute("data-queue-id", it.id);

      const num = li.querySelector(".song-number");
      if(num) num.textContent = (idx + 1);

      const textBox = li.querySelector(".song-text");
      if(textBox){
        const added = document.createElement("div");
        added.className = "song-addedby";
        added.textContent = `von ${it.added_by_name || "?"}`;
        textBox.appendChild(added);
      }

      const removeBtn = li.querySelector("button.remove");
      if(removeBtn){
        if(it.added_by !== state.currentUserId){
          removeBtn.style.display = "none";
        }
      }

      ul.appendChild(li);
    });

    group.appendChild(ul);
    queueContainer.appendChild(group);

    state.auswahlMap.set(cd, group);
  }

  updateSelectionNumbers();
  updateCDButtons();
}

/***********************
 * COMPATIBILITY
 ***********************/
export function updateSelectionNumbers(){
  // kept for compatibility
}

export function updateCDButtons(){
  // kept as no-op
}

/***********************
 * POLLING
 ***********************/
export function startPolling(){
  stopPolling();

  state.pollTimer = setInterval(async ()=>{
    try{
      await loadQueueOnce();
    } catch(e){
      console.error(e);
    }
  }, 2000);
}

export function stopPolling(){
  if(state.pollTimer){
    clearInterval(state.pollTimer);
    state.pollTimer = null;
  }
}

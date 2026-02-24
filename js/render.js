/***********************
 * RENDER / SPOTIFY / SONG ITEMS
 ***********************/
import { searchInput } from "./dom.js";
import { musikDB, modus, modusIcon, auswahlMap } from "./state.js";
import * as state from "./state.js";
import { gefilterteDB } from "./filter.js";
import { addToQueue, deleteQueueItem } from "./queue.js";

/***********************
 * SPOTIFY PLACEMENT
 ***********************/
export function placeSpotifyWidget(){
  const widget = document.getElementById("spotifyWidget");
  if(!widget) return;

  const katalog = document.querySelector(".katalog");
  const selection = document.querySelector(".selection");
  if(!katalog || !selection) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if(isMobile){
    widget.classList.add("mobile-fixed");
    widget.classList.remove("desktop-docked");
    katalog.appendChild(widget);
  } else {
    widget.classList.remove("mobile-fixed");
    widget.classList.add("desktop-docked");
    selection.insertAdjacentElement("afterend", widget);
    widget.style.display = "";
  }
}

/***********************
 * RENDER LIBRARY
 ***********************/
export function render() {
  placeSpotifyWidget();

  const container = document.getElementById("liste");
  container.innerHTML = "";
  const db = gefilterteDB();

  if (state.modus === "interpret") {
    const sorted = [...db].sort((a,b) => a.interpret.localeCompare(b.interpret,'de'));
    const interpreten = [...new Set(sorted.map(s=>s.interpret))];
    let lastLetter = "";

    interpreten.forEach(interpret => {
      const firstLetter = getAlphaLabel(interpret);
      if (firstLetter !== lastLetter) {
        const alphaLabel = document.createElement("div");
        alphaLabel.className = "alpha-label";
        alphaLabel.textContent = firstLetter;
        container.appendChild(alphaLabel);
        lastLetter = firstLetter;
      }

      const group = document.createElement("div");
      group.className = "cd-group expanded";

      const header = document.createElement("div");
      header.className = "cd-header";

      const songsForInterpret = sorted.filter(s => s.interpret === interpret);
      const count = songsForInterpret.length;
      const displayCount = count > 1 ? ` (${count} Songs)` : "";

      header.innerHTML = `<span>${modusIcon[state.modus]} ${interpret}${displayCount}</span>`;
      group.appendChild(header);

      const ul = document.createElement("ul");
      ul.className = "song-list-ul";

      songsForInterpret
        .sort((a,b)=>a.song.localeCompare(b.song,'de'))
        .forEach(song => ul.appendChild(createSongItem(song,true)));

      group.appendChild(ul);
      container.appendChild(group);
    });

    updateStickyLabels();
    updateSpotifyWidget();
    return;
  }

  if (state.modus === "song") {
    const sorted = [...db].sort((a,b)=>a.song.localeCompare(b.song,'de'));
    let lastLetter = "";

    sorted.forEach(s=>{
      const firstLetter = getAlphaLabel(s.song);
      if(firstLetter!==lastLetter){
        const label = document.createElement("div");
        label.className = "alpha-label";
        label.textContent = firstLetter;
        container.appendChild(label);
        lastLetter = firstLetter;
      }
      container.appendChild(createSongItem(s,true));
    });

    updateStickyLabels();
    updateSpotifyWidget();
    return;
  }

  const gruppen = {};
  db.forEach(s=>(gruppen[s.cd]??=[]).push(s));

  Object.keys(gruppen).sort().forEach(name=>{
    const count = gruppen[name].length;

    const group = document.createElement("div");
    group.className = "cd-group collapsed";

    const header = document.createElement("div");
    header.className = "cd-header";
    header.innerHTML = `<span>💿 ${name} (${count})</span>`;
    header.onclick = () => group.classList.toggle("collapsed");

    const list = document.createElement("ul");
    list.className = "song-list-ul";

    gruppen[name]
      .sort((a,b)=>a.song.localeCompare(b.song,'de'))
      .forEach(s=>list.appendChild(createSongItem(s,true)));

    group.append(header,list);
    container.appendChild(group);
  });

  updateSpotifyWidget();
}

/***********************
 * SPOTIFY PLAYER
 ***********************/
export function updateSpotifyWidget() {
  const player = document.getElementById("spotifyPlayer");
  if (!player) return;

  const firstSong = gefilterteDB()[0];

  if(!firstSong) {
    player.textContent = "Wähle einen Song";
    return;
  }

  player.innerHTML =
    `<iframe src="https://open.spotify.com/embed/track/${firstSong.spotifyId}" allow="autoplay"></iframe>`;
}

export function playSpotify(id){
  document.getElementById("spotifyPlayer").innerHTML =
    `<iframe src="https://open.spotify.com/embed/track/${id}" allow="autoplay"></iframe>`;
}

/***********************
 * SONG ITEM CREATION
 ***********************/
export function getAlphaLabel(name) {
  const firstChar = name[0].toUpperCase();
  return /^[0-9]$/.test(firstChar) ? "123" : firstChar;
}

export function createSongItem(song, katalog){
  const li = document.createElement("li");
  li.className = "song-item";

  const info = document.createElement("div");
  info.className = "song-info";

  const num = document.createElement("span");
  num.className = "song-number";
  num.textContent = "";

  const text = document.createElement("div");
  text.className = "song-text";

  const title = document.createElement("span");
  title.className = "song-title";
  title.textContent = song.song;

  const interpret = document.createElement("span");
  interpret.className = "song-interpret";
  interpret.textContent = song.interpret;

  text.append(title,interpret);
  info.append(num,text);

  const actions = document.createElement("div");
  actions.className = "song-actions";

  if(katalog){
    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.onclick = ()=>addToQueue(song);

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";
    playBtn.onclick = ()=>playSpotify(song.spotifyId);

    actions.append(addBtn,playBtn);
  } else {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove";

    removeBtn.onclick = async ()=>{
      const itemId = li.getAttribute("data-queue-id");
      if(!itemId) return;
      await deleteQueueItem(itemId);
    };

    actions.append(removeBtn);
  }

  li.append(info,actions);
  return li;
}

/***********************
 * STICKY LABELS
 ***********************/
export function updateStickyLabels(){
  const container = document.getElementById("liste");
  const labels = container.querySelectorAll(".alpha-label");
  const scrollTop = container.scrollTop;

  labels.forEach(label=>{
    const offset = label.offsetTop - container.offsetTop;
    if(scrollTop>=offset) label.classList.add("sticky-active");
    else label.classList.remove("sticky-active");
  });
}

document.getElementById("liste")
  .addEventListener("scroll", updateStickyLabels);

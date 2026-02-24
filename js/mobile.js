/***********************
 * MOBILE VIEW SWITCH
 ***********************/
export function showView(view){

  document.querySelectorAll(".bottom-nav button")
    .forEach(b=>b.classList.remove("active"));

  document.querySelectorAll(".katalog, .queue-view")
    .forEach(v=>v.classList.remove("active"));

  if(view==="alleSongs")
    document.querySelector(".katalog")?.classList.add("active");

  if(view==="queue")
    document.querySelector(".queue-view")?.classList.add("active");

  document
    .querySelector(`.bottom-nav button[data-view="${view}"]`)
    ?.classList.add("active");

  if(window.matchMedia("(max-width: 768px)").matches){
    const widget = document.getElementById("spotifyWidget");
    if(widget)
      widget.style.display = (view === "alleSongs") ? "block" : "none";
  } else {
    const widget = document.getElementById("spotifyWidget");
    if(widget)
      widget.style.display = "";
  }
}

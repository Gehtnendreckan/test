/***********************
 * JSON LOAD
 ***********************/
import * as state from "./state.js";
import { updateToggleLabels, setModus } from "./mode.js";
import { render } from "./render.js";

export async function loadMusikDB(){
  const response = await fetch("musikdb.json");
  state.musikDB = await response.json();

  updateToggleLabels();
  setModus("interpret");
  render();
}

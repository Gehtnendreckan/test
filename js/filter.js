/***********************
 * FILTER
 ***********************/
import { searchInput } from "./dom.js";
import { musikDB } from "./state.js";

export function gefilterteDB() {
  const q = searchInput.value.toLowerCase();

  return !q
    ? musikDB
    : musikDB.filter(s =>
        `${s.song} ${s.interpret} ${s.cd}`
          .toLowerCase()
          .includes(q)
      );
}

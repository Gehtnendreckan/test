/***********************
 * APP STATE
 ***********************/
export let musikDB = []; 
export let modus = "interpret";
export const modusIcon = { interpret: "🎤", cd: "💿", song: "🔤" };

export let currentUserId = null;
export let currentUserIsAdmin = false; // NEU: Admin Flag
export let partyId = null;
export let partyCode = null;
export let displayName = null;

export let pollTimer = null;

/* Local render helpers */
export const auswahlMap = new Map();

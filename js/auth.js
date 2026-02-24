/***********************
 * AUTH (Admin & Guest)
 ***********************/
let currentUser = null;

async function ensureAuth({ adminEmail, adminPassword } = {}) {
  // Admin-Login
  if(adminEmail && adminPassword){
    const { data, error } = await supa.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    if(error){
      console.error(error);
      throw new Error("Admin Login fehlgeschlagen");
    }
    currentUser = data.user;
    return currentUser;
  }

  // Anonymous Login (für normale Gäste)
  if(currentUser) return currentUser; // schon angemeldet

  const { data, error } = await supa.auth.signInAnonymously();
  if(error){
    console.error(error);
    throw new Error("Anonymous Login fehlgeschlagen");
  }
  currentUser = data.user;
  return currentUser;
}

// Prüfen, ob aktueller User Admin ist
function isAdmin() {
  return currentUser?.user_metadata?.is_admin || false;
}

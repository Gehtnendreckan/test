import { supa } from "./supabase.js";
import { normalizePartyCode, sleep } from "./helpers.js";

/***********************
 * PARTY
 ***********************/
export async function findOrCreatePartyByCode(code, isAdmin=false){
  const clean = normalizePartyCode(code);
  if(!clean) throw new Error("Bitte Party-Code eingeben.");

  // Nur Admins dürfen neue Parties erstellen
  const { data, error } = await supa
    .from("parties")
    .select("id, code")
    .eq("code", clean)
    .maybeSingle();

  if(error) throw new Error("Party lookup fehlgeschlagen.");
  if(data?.id) return { id: data.id, code: data.code };

  if(!isAdmin) throw new Error("Nur Admins können neue Parties erstellen.");

  // Party erstellen
  const ins = await supa
    .from("parties")
    .insert({ code: clean })
    .select("id, code")
    .single();

  if(ins.error){
    console.error(ins.error);
    await sleep(200); // Retry bei Race-Condition
    const retry = await supa
      .from("parties")
      .select("id, code")
      .eq("code", clean)
      .maybeSingle();
    if(retry.error || !retry.data?.id) throw new Error("Party konnte nicht erstellt werden.");
    return { id: retry.data.id, code: retry.data.code };
  }

  return { id: ins.data.id, code: ins.data.code };
}

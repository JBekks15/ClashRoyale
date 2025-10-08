
export async function fetchBattlelogJSON(tag) {
  if (typeof tag !== 'string') throw new Error('tag required');
  const norm = tag.trim().toUpperCase();
  const withHash = norm.startsWith('#') ? norm : `#${norm}`;
  const enc = encodeURIComponent(withHash);

  const resp = await fetch(
    `https://api.clashroyale.com/v1/players/${enc}/battlelog`,
    { headers: { Authorization: `Bearer ${process.env.CR_TOKEN}` } }
  );
  if (!resp.ok) throw new Error(`CR API ${resp.status}`);

  // If this succeeds, we know the tag is valid enough for our purposes
  return await resp.json();
}



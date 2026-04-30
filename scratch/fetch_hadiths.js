const fs = require('fs');

const API_KEY = '$2y$10$3jgs86upPCzEplAuYqUDOeIQuJ0NdMDi7yWDDD0vieKyimI6eugqu';
const TOPICS = ['patience', 'repentance', 'forgiveness', 'perseverance', 'struggle'];

async function fetchHadiths() {
  let allHadiths = [];
  for (const topic of TOPICS) {
    console.log(`Fetching topic: ${topic}...`);
    const url = `https://hadithapi.com/api/hadiths/?apiKey=${encodeURIComponent(API_KEY)}&hadithEnglish=${topic}&status=Sahih&paginate=30`;
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      if (json.hadiths && json.hadiths.data) {
        allHadiths = [...allHadiths, ...json.hadiths.data];
      }
    } catch (e) {
      console.error(`Error fetching ${topic}:`, e);
    }
  }

  const seen = new Set();
  const unique = allHadiths.filter(h => {
    const text = h.hadithEnglish || '';
    if (seen.has(text)) return false;
    seen.add(text);
    return true;
  });

  fs.writeFileSync('hadiths_raw.json', JSON.stringify(unique, null, 2));
  console.log(`Saved ${unique.length} unique hadiths.`);
}

fetchHadiths();

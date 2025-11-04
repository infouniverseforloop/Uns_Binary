// backend/autoTimeSync.js
const fetch = require('node-fetch');
module.exports = {
  sync: async () => {
    try {
      const r = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
      const j = await r.json();
      const serverMs = (j.unixtime ? j.unixtime * 1000 : (new Date(j.datetime)).getTime());
      return { serverTimeMs: serverMs, offsetMs: serverMs - Date.now(), iso: new Date(serverMs).toISOString() };
    } catch (e) { return null; }
  }
};

// backend/cloudSync.js
const fetch = require('node-fetch');
module.exports = {
  saveSignal: async (sig) => {
    if(process.env.CLOUD_SAVE === 'true' && process.env.CLOUD_ENDPOINT){
      try{
        await fetch(process.env.CLOUD_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type':'application/json','x-api-key':process.env.CLOUD_API_KEY||''},
          body: JSON.stringify(sig)
        });
      }catch(e){ console.warn('cloud save failed', e.message); }
    }
    return true;
  }
};

// backend/quotexAdapter.js
const axios = require('axios');
const WebSocket = require('ws');
module.exports = {
  startQuotexAdapter: async (env = {}, callbacks = {}) => {
    const apiUrl = env.apiUrl || process.env.QUOTEX_API_URL;
    const username = env.username || process.env.QUOTEX_USERNAME;
    const password = env.password || process.env.QUOTEX_PASSWORD;
    const wsUrl = env.wsUrl || process.env.QUOTEX_WS_URL;
    const appendTick = callbacks.appendTick || (()=>{});
    if(!apiUrl || !username || !password){
      console.log('quotexAdapter: credentials not set — adapter inactive (placeholder)');
      return { stop: ()=>{} };
    }
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, { username, password }).catch(()=>null);
      const token = res && (res.data && (res.data.token || res.data.access_token));
      console.log('quotexAdapter: placeholder login attempted. token?', !!token);
      if(wsUrl && token){
        const ws = new WebSocket(wsUrl + '?token=' + encodeURIComponent(token));
        ws.on('open', ()=> console.log('quotexAdapter ws open'));
        ws.on('message', m => {
          try{
            const d = JSON.parse(m.toString());
            if(d && d.symbol && d.price) appendTick(d.symbol.toUpperCase(), Number(d.price), Number(d.volume||1), Math.floor((d.time?new Date(d.time).getTime():Date.now())/1000));
          }catch(e){}
        });
        ws.on('error', e => console.warn('quotex ws err', e && e.message));
        ws.on('close', ()=> setTimeout(()=> module.exports.startQuotexAdapter(env, callbacks), 5000));
      }
      return { stop: ()=>{} };
    } catch(e){
      console.warn('quotexAdapter login failed (placeholder)', e.message || e);
      return { stop: ()=>{} };
    }
  },
  placeTrade: async (pair, direction, amount, expirySeconds = 60) => {
    console.log(`PLACE TRADE placeholder -> ${pair} ${direction} ${amount} expiry:${expirySeconds}s`);
    return { success:true, id: 'sim-'+Date.now() };
  },
  pushTelegramSignal: async (sig) => {
    if(process.env.ENABLE_TELEGRAM !== 'true') return;
    const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
    if(!token || !chat) return;
    try { await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chat, text: `Signal: ${sig.symbol} ${sig.direction} conf:${sig.confidence}%` }); } catch(e){}
  }
};

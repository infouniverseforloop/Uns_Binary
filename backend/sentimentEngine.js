// backend/sentimentEngine.js
const cache = {};
function getVolatilityScore(bars){ if(!bars || bars.length<10) return 50; const last = bars.slice(-50); const highs = last.map(b=>b.high), lows = last.map(b=>b.low); const range = Math.max(...highs) - Math.min(...lows); return Math.min(100, Math.round((range / (last[last.length-1].close || 1)) * 1000)); }
function getSentiment(symbol){
  const key = String(symbol).toUpperCase();
  const barsRef = global.barsGlobal || {};
  const bars = barsRef[key] || [];
  const volScore = getVolatilityScore(bars);
  const sentiment = Math.max(0, Math.min(100, 70 - (volScore/2)));
  cache[key] = { sentiment, ts: Date.now() };
  return sentiment;
}
module.exports = { getSentiment };

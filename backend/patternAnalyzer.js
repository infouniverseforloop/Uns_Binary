// backend/patternAnalyzer.js
function isEngulfing(bars){
  if(!bars || bars.length < 2) return false;
  const a = bars[bars.length-2], b = bars[bars.length-1];
  const bodyA = Math.abs(a.close - a.open), bodyB = Math.abs(b.close - b.open);
  return (bodyB > bodyA*1.1) && ((b.close > b.open && a.close < a.open && b.open < a.close && b.close > a.open) || (b.close < b.open && a.close > a.open && b.open > a.close && b.close < a.open));
}
function isPin(b){ if(!b) return false; const body = Math.abs(b.close - b.open); const upper = b.high - Math.max(b.close,b.open); const lower = Math.min(b.close,b.open) - b.low; return (upper > body*2 && lower < body*0.6) || (lower > body*2 && upper < body*0.6); }
function detectPatterns(bars){
  const tags = [];
  if(!bars || bars.length < 3) return tags;
  if(isEngulfing(bars)) tags.push('engulfing');
  if(isPin(bars[bars.length-1])) tags.push('pin');
  return tags;
}
module.exports = { detectPatterns };

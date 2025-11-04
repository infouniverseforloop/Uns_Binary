// backend/modeDetector.js
module.exports = {
  detectMode: (bars) => {
    if(!bars || bars.length < 40) return 'no-trade';
    const last = bars.slice(-40);
    const highs = last.map(b=>b.high), lows = last.map(b=>b.low);
    const range = Math.max(...highs) - Math.min(...lows);
    const vol = (last.reduce((s,b)=> s + (b.volume||0),0) / last.length);
    if(range / (last[last.length-1].close || 1) > 0.02) return 'volatile';
    if(vol > 1000) return 'high-liquidity';
    return 'normal';
  }
};

// backend/liquidityDetector.js
module.exports = {
  check: (bars) => {
    if(!bars || bars.length < 20) return { forbid:false, reason:'insufficient' };
    const last10 = bars.slice(-10);
    const highs = last10.map(b=>b.high), lows = last10.map(b=>b.low);
    const range = Math.max(...highs) - Math.min(...lows);
    const last = last10[last10.length-1];
    if((last.high - last.low) > (range * 0.6)) return { forbid:true, reason:'liquidity-sweep' };
    return { forbid:false };
  }
};

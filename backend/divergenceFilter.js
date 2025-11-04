// backend/divergenceFilter.js
function simpleRSI(closes, period=14){
  if(!closes || closes.length < period+1) return 50;
  let gains=0, losses=0;
  for(let i=closes.length-period;i<closes.length;i++){ const d = closes[i]-closes[i-1]; if(d>0) gains+=d; else losses+=Math.abs(d); }
  const avgG = gains/period, avgL = (losses/period)||1e-8; const rs = avgG/avgL; return 100 - (100/(1+rs));
}
module.exports = {
  check: (bars) => {
    if(!bars || bars.length < 40) return { forbid:false };
    const closes = bars.map(b=>b.close);
    const rsiNow = simpleRSI(closes.slice(-20),14);
    const rsiPrev = simpleRSI(closes.slice(-40,-20),14);
    if(rsiPrev > 60 && rsiNow < 40) return { forbid:true, reason:'momentum-divergence' };
    if(rsiPrev < 40 && rsiNow > 60) return { forbid:true, reason:'momentum-divergence' };
    return { forbid:false };
  }
};

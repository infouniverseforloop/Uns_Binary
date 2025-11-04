// backend/resultResolver.js
module.exports = {
  start: function (opts = {}) {
    const signalsRef = opts.signalsRef || [];
    const barsRef = opts.barsRef || {};
    const broadcast = opts.broadcast || (()=>{});
    setInterval(()=>{
      try{
        const nowTs = Math.floor(Date.now()/1000);
        for(const r of signalsRef){
          if(r.result) continue;
          if(!r.expiry_ts) continue;
          if(nowTs < r.expiry_ts) continue;
          const bars = (barsRef[r.symbol] || []);
          const final = bars.find(b=>b.time >= r.expiry_ts) || bars[bars.length-1];
          if(!final) continue;
          const finalPrice = final.close;
          let won = false;
          if(r.direction === 'CALL') won = finalPrice >= (r.entry || 0);
          else won = finalPrice <= (r.entry || 0);
          r.result = won ? 'WIN' : 'LOSS';
          broadcast({ type:'signal_result', data:{ id:r.id, symbol:r.symbol, result: r.result, finalPrice }});
          try{
            const ai = require('./aiLearner');
            const fv = { fvg: r.notes && r.notes.includes('fvg'), volumeSpike: r.notes && r.notes.includes('volSpike'), manipulation: false, ob: r.notes && r.notes.includes('ob') };
            ai.recordOutcome && ai.recordOutcome(fv, won);
          }catch(e){}
        }
      }catch(e){}
    }, 3000);
  }
};

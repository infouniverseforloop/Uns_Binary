// backend/deepsentiment.js
module.exports = {
  estimate: (symbol, bars) => {
    if(!bars || bars.length < 20) return { bias:0, score:50 };
    const last = bars.slice(-20);
    let buy=0, sell=0;
    for(const b of last){ if(b.close > b.open) buy++; else if(b.close < b.open) sell++; }
    const bias = Math.round((buy - sell) / 2);
    return { bias, score: 50 + bias };
  }
};

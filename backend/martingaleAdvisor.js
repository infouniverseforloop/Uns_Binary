// backend/martingaleAdvisor.js
function suggest({ symbol, recentSignals = [], confidence = 50, riskScore = 0 }){
  if(riskScore >= 60) return { decision:'NO', reason:'High risk score', riskScore };
  const last10 = recentSignals.slice(-10);
  const losses = last10.filter(s=> s.result === 'LOSS').length;
  const wins = last10.filter(s=> s.result === 'WIN').length;
  const lossRate = last10.length ? (losses / last10.length) : 0;
  if(lossRate > 0.6) return { decision:'NO', reason:'Recent loss streak', lossRate };
  if(confidence >= 75) return { decision:'SUGGEST', reason:'High confidence', factor:2 };
  if(confidence >= 60 && lossRate < 0.3) return { decision:'SUGGEST', reason:'Moderate confidence & manageable losses', factor:1.5 };
  return { decision:'NO', reason:'Confidence too low or conditions not good', confidence, lossRate };
}
module.exports = { suggest };

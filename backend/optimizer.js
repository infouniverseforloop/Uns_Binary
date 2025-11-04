// backend/optimizer.js
const fs = require('fs');
const path = require('path');
function analyzeAndTune(signalsRef, ai){
  try{
    const last = signalsRef.slice(-200);
    const wins = last.filter(r=>r.result==='WIN').length;
    const losses = last.filter(r=>r.result==='LOSS').length;
    const total = Math.max(1, wins+losses);
    const winRate = (wins/total)*100;
    const state = ai.getState();
    if(winRate < 45) { state.alpha = Math.max(0.01, (state.alpha||0.05) - 0.005); }
    else if(winRate > 60) { state.alpha = Math.min(0.2, (state.alpha||0.05) + 0.005); }
    fs.writeFileSync(path.join(__dirname,'..','data','optimizer_state.json'), JSON.stringify({ winRate, timestamp:Date.now(), alpha: state.alpha },null,2));
  }catch(e){}
}
function start(opts = {}){ const signalsRef = opts.signalsRef || []; const ai = opts.ai || require('./aiLearner'); setInterval(()=> analyzeAndTune(signalsRef, ai), 60_000); }
module.exports = { start };

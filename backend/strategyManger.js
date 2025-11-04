const ai = require('./aiLearner');
function applyWeights(candidate, ctx){
  const state = ai.getState();
  const weights = state.weights || { fvg:1, volume:1, manipulation:-2, bos:1 };
  let conf = candidate.confidence || 50;
  if(candidate.notes && candidate.notes.includes('fvg')) conf += (weights.fvg||0);
  if(candidate.notes && candidate.notes.includes('volSpike')) conf += (weights.volume||0);
  if(candidate.notes && candidate.notes.includes('bos')) conf += (weights.bos||0);
  if(ctx && ctx.sentiment) conf += Math.round((ctx.sentiment - 50)/8);
  candidate.notes = candidate.notes || '';
  candidate.notes = candidate.notes + `|weightsApplied`;
  candidate.confidence = Math.max(1, Math.min(99, Math.round(conf)));
  return candidate;
}
module.exports = { applyWeights };
    

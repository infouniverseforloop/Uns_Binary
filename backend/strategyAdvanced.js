// backend/strategyAdvanced.js (FINAL)
const ai = require('./aiLearner');
const manipulationDetector = require('./manipulationDetector');
const martingaleAdvisor = require('./martingaleAdvisor');

function applyModeAdjustments(baseConf, mode){
  if(mode === 'god'){ return Math.min(99, Math.round(baseConf + 6)); }
  else { return Math.max(1, Math.round(baseConf)); }
}

module.exports = {
  evaluateCandidate: (candidate, bars, opts = {}) => {
    const mode = (opts.mode || 'normal').toString().toLowerCase();
    if (!candidate) return null;
    let base = candidate.confidence || 50;
    const manip = manipulationDetector.detect([], bars ? bars.slice(-120) : []);
    if (manip && manip.score > 40) base -= Math.round(manip.score * 0.2);
    const fv = {
      fvg: candidate.notes && candidate.notes.includes('fvg'),
      volumeSpike: candidate.notes && candidate.notes.includes('volSpike'),
      ob: candidate.notes && candidate.notes.includes('ob'),
      manipulation: manip.score > 30
    };
    const boost = ai.predictBoost ? ai.predictBoost(fv) : 0;
    let confirmation = Math.max(1, Math.min(99, Math.round(base + boost)));
    confirmation = applyModeAdjustments(confirmation, mode);
    if(mode === 'god'){
      let layers = 0;
      if(candidate.notes && (candidate.notes.includes('ob') || candidate.notes.includes('fvg'))) layers++;
      if(candidate.confidence >= 60) layers++;
      if(candidate.notes && candidate.notes.includes('volSpike')) layers++;
      if(layers < 2) return { ok:false, confirmation, direction: candidate.direction, notes:`insufficient_layers:${layers}`, mtg:{decision:'NO'} };
    }
    const mtg = martingaleAdvisor.suggest ? martingaleAdvisor.suggest({ symbol: candidate.symbol, recentSignals: opts.recentSignals || [], confidence: confirmation, riskScore: (opts.riskScore||0) }) : { decision:'NO' };
    return { ok: confirmation >= parseInt(process.env.MIN_BROADCAST_CONF || '55',10), confirmation, direction: candidate.direction, notes: `boost:${boost}|manip:${manip.score||0}`, mtg };
  }
};

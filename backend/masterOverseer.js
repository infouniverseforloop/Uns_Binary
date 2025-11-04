// backend/masterOverseer.js
module.exports = {
  decide: ({ symbol, candidate, bars }) => {
    const base = candidate.confidence || 50;
    const structureBonus = (candidate.notes && candidate.notes.includes('ob')) ? 6 : 0;
    const score = Math.max(1, Math.min(99, base + structureBonus));
    const ok = score >= parseInt(process.env.MIN_BROADCAST_CONF || '55',10);
    const preSignal = (score >= (parseInt(process.env.MIN_BROADCAST_CONF || '55',10) - 10));
    return { ok, score, preSignal };
  }
};

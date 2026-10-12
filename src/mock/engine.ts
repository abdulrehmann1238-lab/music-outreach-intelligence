import { Prospect, GateResult, SettingsState } from '../types';

export function calculateScore(
  prospect: Prospect,
  customWeights?: Record<string, number>
): { score: number; arithmetic: string; breakdown: { name: string; earned: number; weight: number }[] } {
  let totalScore = 0;
  const parts: string[] = [];
  const breakdown: { name: string; earned: number; weight: number }[] = [];

  for (const comp of prospect.scoreComponents) {
    const weight = customWeights && customWeights[comp.id] !== undefined
      ? customWeights[comp.id]
      : comp.defaultWeight;

    // If unsupported, scores 0!
    const earned = comp.isUnsupported ? 0 : Math.round(comp.rawRatio * weight);
    totalScore += earned;
    parts.push(`${earned}`);
    breakdown.push({
      name: comp.name,
      earned,
      weight
    });
  }

  const arithmetic = parts.length > 0 ? `${parts.join(' + ')} = ${totalScore}` : `${totalScore}`;
  return { score: totalScore, arithmetic, breakdown };
}

export function getScoreBand(score: number, thresholds: SettingsState['thresholds']): {
  band: 'high_priority' | 'qualified' | 'manual_review' | 'do_not_contact';
  label: string;
} {
  if (score >= thresholds.highPriority) {
    return { band: 'high_priority', label: 'High priority (85–100)' };
  }
  if (score >= thresholds.qualified) {
    return { band: 'qualified', label: 'Qualified (75–84)' };
  }
  if (score >= thresholds.manualReview) {
    return { band: 'manual_review', label: 'Manual review (65–74)' };
  }
  return { band: 'do_not_contact', label: 'Do not contact (<65)' };
}

export function evaluateHardGates(prospect: Prospect): {
  allPassed: boolean;
  failedGates: GateResult[];
} {
  const failedGates = prospect.gates.filter(g => !g.passed);
  return {
    allPassed: failedGates.length === 0,
    failedGates
  };
}

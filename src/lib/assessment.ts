import { Asset, AssessmentSummary, Finding, Severity } from './types';
import { runRules } from './rules';

const penalties: Record<Severity, number> = {
  critical: 18,
  high: 10,
  medium: 5,
  low: 2,
};

export function calculateCompleteness(assets: Asset[]): number {
  if (!assets.length) return 0;
  const requiredFields: (keyof Asset)[] = ['hostname', 'type', 'environment', 'os', 'osVersion'];
  let present = 0;
  let total = assets.length * requiredFields.length;
  for (const asset of assets) {
    for (const field of requiredFields) {
      const value = asset[field];
      if (value !== undefined && value !== null && value !== '' && value !== 'unknown') present += 1;
    }
  }
  return Math.round((present / total) * 100);
}

export function calculateConfidence(assets: Asset[]): number {
  const evidence = assets.flatMap((a) => a.evidence);
  if (!evidence.length) return 0;
  return Math.round(evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length);
}

export function calculateHealth(findings: Finding[]): number {
  const penalty = findings.reduce((sum, f) => sum + penalties[f.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function assessInfrastructure(assets: Asset[]): AssessmentSummary {
  const findings = runRules(assets);
  const lifecycleFindings = findings.filter((f) => f.domain === 'Lifecycle');
  const qualityFindings = findings.filter((f) => f.domain === 'Assessment Quality');

  return {
    overallHealth: calculateHealth(findings.filter((f) => f.domain !== 'Assessment Quality')),
    completeness: calculateCompleteness(assets),
    confidence: calculateConfidence(assets),
    findings,
    domainScores: {
      Lifecycle: calculateHealth(lifecycleFindings),
      'Assessment Quality': calculateHealth(qualityFindings),
    },
  };
}

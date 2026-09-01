import { Asset, Finding } from './types';

type Rule = {
  id: string;
  title: string;
  domain: string;
  evaluate: (asset: Asset) => Omit<Finding, 'id'> | null;
};

const unsupportedOsPatterns = [
  /windows server 2008/i,
  /windows server 2012/i,
  /rhel\s*6/i,
  /centos\s*6/i,
];

export const rules: Rule[] = [
  {
    id: 'OS-LC-001',
    title: 'Potential unsupported operating system detected',
    domain: 'Lifecycle',
    evaluate(asset) {
      const osText = `${asset.os ?? ''} ${asset.osVersion ?? ''}`.trim();
      if (!osText || !unsupportedOsPatterns.some((p) => p.test(osText))) return null;

      const production = asset.environment === 'production';
      return {
        ruleId: 'OS-LC-001',
        title: 'Potential unsupported operating system detected',
        domain: 'Lifecycle',
        severity: production ? 'high' : 'medium',
        description: `${asset.hostname} appears to run an operating system version that requires lifecycle verification.`,
        risk: 'Unsupported platforms can increase security, stability, vendor-support and operational risk.',
        recommendation: 'Validate vendor lifecycle status, then upgrade, migrate or formally accept the risk with an approved remediation date.',
        affectedAssetIds: [asset.id],
        evidenceIds: asset.evidence.map((e) => e.id),
        confidence: asset.evidence.length ? Math.max(...asset.evidence.map((e) => e.confidence)) : 50,
      };
    },
  },
  {
    id: 'DATA-001',
    title: 'Missing operating system evidence',
    domain: 'Assessment Quality',
    evaluate(asset) {
      if (asset.type !== 'physical' && asset.type !== 'vm') return null;
      if (asset.os) return null;
      return {
        ruleId: 'DATA-001',
        title: 'Missing operating system evidence',
        domain: 'Assessment Quality',
        severity: 'low',
        description: `${asset.hostname} has no verified operating system information.`,
        risk: 'Lifecycle and compatibility assessment may be incomplete.',
        recommendation: 'Provide OS name and version from a trusted inventory or collector.',
        affectedAssetIds: [asset.id],
        evidenceIds: asset.evidence.map((e) => e.id),
        confidence: 100,
      };
    },
  },
];

export function runRules(assets: Asset[]): Finding[] {
  const findings: Finding[] = [];
  for (const asset of assets) {
    for (const rule of rules) {
      const result = rule.evaluate(asset);
      if (result) findings.push({ id: `${rule.id}-${asset.id}`, ...result });
    }
  }
  return findings;
}

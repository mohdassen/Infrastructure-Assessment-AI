export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type EvidenceStatus = 'observed' | 'inferred' | 'not_verified';

export interface Evidence {
  id: string;
  sourceFile: string;
  location: string;
  field?: string;
  value?: string;
  status: EvidenceStatus;
  confidence: number;
}

export interface Asset {
  id: string;
  hostname: string;
  type: 'physical' | 'vm' | 'database' | 'storage' | 'backup' | 'other';
  environment?: 'production' | 'dr' | 'development' | 'test' | 'unknown';
  os?: string;
  osVersion?: string;
  cpuCores?: number;
  memoryGb?: number;
  storageGb?: number;
  platform?: string;
  application?: string;
  businessCriticality?: 'critical' | 'high' | 'medium' | 'low';
  evidence: Evidence[];
}

export interface Finding {
  id: string;
  ruleId: string;
  title: string;
  domain: string;
  severity: Severity;
  description: string;
  risk: string;
  recommendation: string;
  affectedAssetIds: string[];
  evidenceIds: string[];
  confidence: number;
}

export interface AssessmentSummary {
  overallHealth: number;
  completeness: number;
  confidence: number;
  findings: Finding[];
  domainScores: Record<string, number>;
}

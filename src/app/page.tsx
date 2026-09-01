import { assessInfrastructure } from '../lib/assessment';
import { Asset } from '../lib/types';

const sampleAssets: Asset[] = [
  {
    id: 'srv-001',
    hostname: 'APP-PROD-01',
    type: 'vm',
    environment: 'production',
    os: 'Windows Server',
    osVersion: '2012 R2',
    cpuCores: 8,
    memoryGb: 32,
    businessCriticality: 'high',
    evidence: [
      {
        id: 'ev-001',
        sourceFile: 'Server_Inventory.xlsx',
        location: 'Servers!Row 31',
        field: 'Operating System',
        value: 'Windows Server 2012 R2',
        status: 'observed',
        confidence: 99,
      },
    ],
  },
  {
    id: 'srv-002',
    hostname: 'WEB-PROD-02',
    type: 'vm',
    environment: 'production',
    os: 'RHEL',
    osVersion: '8.10',
    cpuCores: 4,
    memoryGb: 16,
    businessCriticality: 'medium',
    evidence: [
      {
        id: 'ev-002',
        sourceFile: 'RVTools.xlsx',
        location: 'vInfo!Row 228',
        field: 'Guest OS',
        value: 'RHEL 8.10',
        status: 'observed',
        confidence: 98,
      },
    ],
  },
  {
    id: 'srv-003',
    hostname: 'LEGACY-APP-03',
    type: 'vm',
    environment: 'development',
    evidence: [
      {
        id: 'ev-003',
        sourceFile: 'Server_Inventory.xlsx',
        location: 'Servers!Row 77',
        status: 'observed',
        confidence: 97,
      },
    ],
  },
];

export default function HomePage() {
  const assessment = assessInfrastructure(sampleAssets);
  const counts = assessment.findings.reduce(
    (acc, finding) => {
      acc[finding.severity] += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">INFRASTRUCTURE INTELLIGENCE</p>
          <h1>Infrastructure Assessment AI</h1>
          <p className="subtitle">Evidence-first assessment. Every conclusion should be traceable and defensible.</p>
        </div>
        <button className="primary">New Assessment</button>
      </header>

      <section className="heroGrid">
        <article className="scoreCard">
          <span>Infrastructure Health</span>
          <strong>{assessment.overallHealth}</strong>
          <small>/ 100</small>
        </article>
        <article className="metricCard"><span>Assessment completeness</span><strong>{assessment.completeness}%</strong></article>
        <article className="metricCard"><span>Evidence confidence</span><strong>{assessment.confidence}%</strong></article>
        <article className="metricCard"><span>Assets discovered</span><strong>{sampleAssets.length}</strong></article>
      </section>

      <section className="riskRow">
        <div><span>Critical</span><b>{counts.critical}</b></div>
        <div><span>High</span><b>{counts.high}</b></div>
        <div><span>Medium</span><b>{counts.medium}</b></div>
        <div><span>Low</span><b>{counts.low}</b></div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">DETERMINISTIC FINDINGS</p>
            <h2>Priority findings</h2>
          </div>
          <span>{assessment.findings.length} findings</span>
        </div>

        <div className="findingList">
          {assessment.findings.map((finding) => (
            <article className="finding" key={finding.id}>
              <div className={`severity ${finding.severity}`}>{finding.severity}</div>
              <div className="findingBody">
                <div className="findingTitleRow">
                  <h3>{finding.title}</h3>
                  <code>{finding.ruleId}</code>
                </div>
                <p>{finding.description}</p>
                <dl>
                  <div><dt>Risk</dt><dd>{finding.risk}</dd></div>
                  <div><dt>Recommendation</dt><dd>{finding.recommendation}</dd></div>
                  <div><dt>Confidence</dt><dd>{finding.confidence}%</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">SOURCE TRACEABILITY</p>
            <h2>Evidence ledger</h2>
          </div>
        </div>
        <div className="evidenceTable">
          {sampleAssets.flatMap((asset) => asset.evidence.map((evidence) => (
            <div className="evidenceRow" key={evidence.id}>
              <b>{asset.hostname}</b>
              <span>{evidence.sourceFile}</span>
              <span>{evidence.location}</span>
              <span>{evidence.status}</span>
              <span>{evidence.confidence}%</span>
            </div>
          )))}
        </div>
      </section>
    </main>
  );
}

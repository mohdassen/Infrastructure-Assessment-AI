import { Asset, Evidence } from './types';

const aliases = {
  hostname: ['hostname', 'host name', 'server', 'server name', 'vm', 'vm name', 'name'],
  os: ['os', 'operating system', 'guest os', 'guest_os'],
  osVersion: ['os version', 'version', 'os_version', 'operating system version'],
  environment: ['environment', 'env', 'tier'],
  cpuCores: ['cpu', 'cpus', 'cpu cores', 'cores', 'vcpu', 'vcpus'],
  memoryGb: ['memory', 'memory gb', 'ram', 'ram gb'],
  storageGb: ['storage', 'storage gb', 'disk gb', 'provisioned space gb'],
} as const;

function key(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function pick(row: Record<string, unknown>, names: readonly string[]): unknown {
  const normalized = new Map(Object.entries(row).map(([k, v]) => [key(k), v]));
  for (const name of names) {
    const value = normalized.get(key(name));
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return undefined;
}

function numberOrUndefined(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeEnvironment(value: unknown): Asset['environment'] {
  const text = key(String(value ?? ''));
  if (/prod|production/.test(text)) return 'production';
  if (/\bdr\b|disaster recovery/.test(text)) return 'dr';
  if (/dev|development/.test(text)) return 'development';
  if (/test|uat|qa/.test(text)) return 'test';
  return 'unknown';
}

export function normalizeInventoryRows(
  rows: Record<string, unknown>[],
  sourceFile: string,
  sheet = 'Inventory'
): Asset[] {
  return rows
    .map((row, index) => {
      const hostname = String(pick(row, aliases.hostname) ?? '').trim();
      if (!hostname) return null;

      const os = pick(row, aliases.os);
      const osVersion = pick(row, aliases.osVersion);
      const evidence: Evidence[] = [
        {
          id: `ev-${sourceFile}-${index + 2}`,
          sourceFile,
          location: `${sheet}!Row ${index + 2}`,
          status: 'observed',
          confidence: 98,
        },
      ];

      return {
        id: `asset-${index + 1}-${hostname.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        hostname,
        type: 'vm',
        environment: normalizeEnvironment(pick(row, aliases.environment)),
        os: os ? String(os).trim() : undefined,
        osVersion: osVersion ? String(osVersion).trim() : undefined,
        cpuCores: numberOrUndefined(pick(row, aliases.cpuCores)),
        memoryGb: numberOrUndefined(pick(row, aliases.memoryGb)),
        storageGb: numberOrUndefined(pick(row, aliases.storageGb)),
        evidence,
      } satisfies Asset;
    })
    .filter((asset): asset is Asset => asset !== null);
}

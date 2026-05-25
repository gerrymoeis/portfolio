export type Tier = 'low' | 'medium' | 'high';

export function getDeviceTier(): Tier {
  if (typeof window === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 2) return 'low';
  if (cores <= 4 && (navigator.deviceMemory ?? 8) <= 4) return 'medium';
  return 'high';
}

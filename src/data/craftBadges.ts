type CraftType = 'ai' | 'hand-crafted'

export const craftBadgeLabels: Record<CraftType, { en: string; id: string }> = {
  ai: { en: 'AI Assisted', id: 'Berbantuan AI' },
  'hand-crafted': { en: 'Hand Crafted', id: 'Buatan Tangan' },
}

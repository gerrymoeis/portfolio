type CraftType = 'ai' | 'hand-crafted'
type CraftContext = 'project' | 'blog'

export const craftBadgeLabels: Record<CraftType, Record<CraftContext, { en: string; id: string }>> = {
  ai: {
    project: { en: 'AI Assisted', id: 'Berbantuan AI' },
    blog: { en: 'AI Written', id: 'Ditulis AI' },
  },
  'hand-crafted': {
    project: { en: 'Hand Crafted', id: 'Buatan Tangan' },
    blog: { en: 'Hand Written', id: 'Tulisan Tangan' },
  },
}

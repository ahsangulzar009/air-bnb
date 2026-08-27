import type { DemoProperty } from '@/lib/types/demo-property'
import { US_LISTINGS_SEED } from '@/seed/us-listings'

export type { DemoProperty } from '@/lib/types/demo-property'

let inMemoryCache: DemoProperty[] | null = null;
export async function fetchDemoProperties() {
  if (inMemoryCache) return inMemoryCache
  inMemoryCache = US_LISTINGS_SEED
  return inMemoryCache
}
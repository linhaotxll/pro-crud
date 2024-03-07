import type { ResolvedProComponentsOptions } from './interface'
import type { InjectionKey } from 'vue'

export const GlobalOption =
  Symbol() as InjectionKey<ResolvedProComponentsOptions>

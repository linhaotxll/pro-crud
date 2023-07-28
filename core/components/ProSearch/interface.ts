import type { ProFormInstance, ProFormOptions, ProFormScope } from '../ProForm'
import type { Ref } from 'vue'

export type ProSearchScope<T extends object> = ProFormScope<T>

export type ProSearchOptions<T extends object, R = T> = ProFormOptions<T, R>

export interface UseSearchReturn<T extends object, R = T> {
  proSearchRef: Ref<ProSearchInstance | null>
  searchBinding: ProSearchOptions<T, R>
}

export type ProSearchInstance = ProFormInstance

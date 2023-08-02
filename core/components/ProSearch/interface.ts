import type { ProFormInstance, ProFormProps, ProFormScope } from '../ProForm'
import type { Ref } from 'vue'

export type ProSearchScope<T extends object> = ProFormScope<T>

export type ProSearchOptions<T extends object, R = T> = ProFormProps<T, R>

export interface UseSearchReturn<T extends object, R = T> {
  proSearchRef: Ref<ProSearchInstance<T> | null>
  searchBinding: ProSearchOptions<T, R>
}

export type ProSearchInstance<T extends object> = ProFormInstance<T>

import type { ProSearchInstance } from './../ProSearch/interface'
import type { ProTableInstance } from './../ProTable/interface'
import type { InjectionKey, Ref } from 'vue'

export const ProSearchRef = Symbol() as InjectionKey<
  Ref<ProSearchInstance<any> | null>
>

export const ProTableRef = Symbol() as InjectionKey<
  Ref<ProTableInstance<any> | null>
>

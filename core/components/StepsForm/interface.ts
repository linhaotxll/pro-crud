import type { DataObject } from './../common/interface'
import type {
  BuildFormOptionResult,
  ProFormScope,
} from './../ProForm/interface'
import type { StepProps, StepsProps } from 'ant-design-vue'
import type { MaybeRefOrGetter } from 'vue'
/**
 * buildStepsForm 返回值
 */
export interface BuildStepsFormReturn<Forms extends DataObject = DataObject>
  extends Omit<BuildFormOptionResult, 'columns'> {
  /**
   * steps props
   */
  stepsProps?: MaybeRefOrGetter<Omit<StepsProps, 'items'>>

  /**
   * 步骤配置
   */
  steps?: MaybeRefOrGetter<StepsOptions<Forms>>
}

export type StepsOptions<Forms extends DataObject = DataObject> = {
  [K in keyof Forms]: StepOptions<Forms[K]>
}

/**
 * Step Form 每一步配置
 */
export interface StepOptions<Form extends DataObject = DataObject>
  extends StepProps,
    BuildFormOptionResult<Form> {
  //
  /**
   * 步骤顺序
   */
  order?: number
}

/**
 * Steps Form 作用域
 */
export interface StepsFormScope<Forms extends DataObject = DataObject>
  extends ProFormScope<Forms> {
  [name: string]: any
}

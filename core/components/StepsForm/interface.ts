import type { DataObject } from './../common/interface'
import type {
  BuildFormOptionResult,
  ProFormScope,
} from './../ProForm/interface'
import type { CustomRender } from '../CustomRender'
import type { StepProps, StepsProps } from 'ant-design-vue'
import type { MaybeRefOrGetter, VNodeChild } from 'vue'
/**
 * buildStepsForm 返回值
 */
export interface BuildStepsFormReturn<Forms extends DataObject = DataObject>
  extends Omit<BuildFormOptionResult<Forms>, 'columns'> {
  /**
   * steps props
   */
  stepsProps?: MaybeRefOrGetter<Omit<StepsProps, 'items'>>

  /**
   * 步骤配置
   */
  steps?: MaybeRefOrGetter<StepOptions<Forms>[]>

  /**
   * 包裹容器
   */
  wrap?: Omit<CustomRender<CustomRenderStepsFormWrapContext>, 'fallback'>
}

// export type StepsOptions<Forms extends DataObject = DataObject> = {
//   [K in keyof Forms]: StepOptions<Forms[K]>
// }

/**
 * Step Form 每一步配置
 */
export interface StepOptions<Form extends DataObject = DataObject>
  extends StepProps,
    BuildFormOptionResult<Form> {
  //
}

/**
 * Steps Form 作用域
 */
export interface StepsFormScope<Forms extends DataObject = DataObject>
  extends ProFormScope<Forms> {
  /**
   * 下一步
   */
  nextStep(): void

  /**
   * 上一步
   */
  previousStep(): void
}

/**
 * Steps Form 自定义渲染容器作用域
 */
export interface CustomRenderStepsFormWrapContext {
  $steps: VNodeChild
  $form: VNodeChild
}

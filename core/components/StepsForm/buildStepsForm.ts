import { get, has, set } from 'lodash-es'
import { computed, nextTick, ref, toRef, toValue, unref, watch } from 'vue'

import { mergeWithTovalue } from '../common'
import { buildForm } from '../ProForm'

import { isFunction, isPromise } from '~/utils'

import type { DataObject } from './../common/interface'
import type {
  BuildStepsFormReturn,
  StepOptions,
  StepsFormScope,
} from './interface'
import type { CustomRender } from '../CustomRender'
import type { ActionOption } from '../ProButton'
import type {
  BuildFormOptionResult,
  ProFormActionGroup,
  ProFormColumnOptions,
} from '../ProForm'
import type { StepsProps } from 'ant-design-vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

export type FunctionKeys<Form extends DataObject = DataObject> = Pick<
  BuildFormOptionResult<Form>,
  'beforeSubmit' | 'submitRequest' | 'validateFail' | 'successRequest'
>

export function buildStepsForm<Forms extends DataObject = DataObject>(
  options: (scope: StepsFormScope<Forms>) => BuildStepsFormReturn<Forms>
) {
  // 第一页索引
  const firstIndex = 0

  // 解析好的 Steps Props
  let resolvedStepProps: ComputedRef<StepsProps>

  let resolvedWrap: CustomRender | undefined

  const { proFormBinding } = buildForm(scope => {
    const stepsFormScope: StepsFormScope<Forms> = {
      ...scope,
      nextStep: handleNextStep,
      previousStep: handlePreviousStep,
    }

    const {
      stepsProps,
      steps,
      initialValues: formsInitialValues,
      wrap,
      ...commonForm
    } = options(stepsFormScope)

    resolvedWrap = wrap

    // 步骤列表
    const items = ref<StepsProps['items']>([])

    // 步骤索引映射步骤表单列
    const columnsMap = ref<
      Record<
        number,
        MaybeRefOrGetter<ProFormColumnOptions<Forms, any, any>[]> | undefined
      >
    >({})

    // 步骤索引映射表单操作
    const actionMap = ref(
      {} as Record<number, MaybeRefOrGetter<ProFormActionGroup> | undefined>
    )

    // 步骤索引映射表单 Props
    const formPropsMap = ref<
      Record<number, BuildFormOptionResult['formProps']>
    >({})

    // 步骤对象
    const stepsRef = toRef(steps) as Ref<StepOptions<Forms>[]>

    //  步骤索引映射表单操作
    const funcMap: Record<number, FunctionKeys> = {}

    // 当前步骤索引
    const current = ref(firstIndex)

    // 解析 Steps Props
    resolvedStepProps = computed<StepsProps>(() =>
      mergeWithTovalue({}, stepsProps, {
        items,
        current: current.value,
        'onUpdate:current'(value: number) {
          current.value = value
        },
      })
    )

    // 下一步按钮
    const nextButton: ActionOption = {
      text: '下一步',
    }

    // 上一步按钮
    const previousButton: ActionOption = {
      text: '上一步',
      props: { onClick: handlePreviousStep },
    }

    // 完成按钮
    const finishButton: ActionOption = {
      text: '完成',
      props: { type: 'primary' },
    }

    // 第一页按钮
    const firstStepAction: ProFormActionGroup = {
      actions: {
        confirm: nextButton,
      },
    }

    // 中间页按钮
    const middleStepAction: ProFormActionGroup = {
      actions: {
        previous: previousButton,
        confirm: nextButton,
      },
    }

    // 最后一页页按钮
    const lastStepAction: ProFormActionGroup = {
      actions: {
        previous: previousButton,
        confirm: finishButton,
      },
    }

    // 是否是最后一步
    function isLast() {
      return current.value === Object.keys(stepsRef.value).length - 1
    }

    const resolvedSubmitParams: any = {}

    // 每一步最终的表单数据
    const paramsMap: Record<number, any> = {}

    function callCommonBeforeSubmit(values: Forms) {
      const beforeSubmitResult =
        unref(commonForm.beforeSubmit)?.(values) ?? values
      if (isPromise(beforeSubmitResult)) {
        return beforeSubmitResult.then(res => {
          callCommonSubmitRequest(res)
        })
      } else {
        return callCommonSubmitRequest(beforeSubmitResult)
      }
    }

    function callCommonSubmitRequest(values: Forms) {
      const successRequestResult = unref(commonForm.submitRequest)?.(values)
      if (isPromise(successRequestResult)) {
        return successRequestResult.then(() => {
          callCommonSuccessRequest(values)
        })
      } else {
        return callCommonSuccessRequest(values)
      }
    }

    function callCommonSuccessRequest(values: Forms) {
      //
      unref(commonForm.successRequest)?.(values)
    }

    const buildFormReturn: BuildFormOptionResult = {
      columns: computed(() => {
        return columnsMap.value[current.value] as any
      }),
      action: computed(() => {
        let defaultAction: ProFormActionGroup = middleStepAction
        const currentStep = current.value
        if (currentStep === firstIndex) {
          defaultAction = firstStepAction
        } else if (currentStep === Object.keys(stepsRef.value).length - 1) {
          defaultAction = lastStepAction
        }
        const { actions, ...commonRest } = toValue(commonForm.action) || {}
        return mergeWithTovalue(
          {},
          defaultAction,
          commonRest,
          actionMap.value[current.value]
        )
      }),

      initialValues: formsInitialValues,

      submitRequest(values) {
        return unref(funcMap[current.value]?.submitRequest)?.(values) ?? true
      },
      successRequest(values) {
        paramsMap[current.value] = values
        unref(funcMap[current.value]?.successRequest)?.(values)
        if (isLast()) {
          const map = columnsMap.value
          const columnsKeys = Object.keys(map)
          const params = {} as Forms
          for (let i = 0; i < columnsKeys.length; ++i) {
            const currentStepForm = paramsMap[i]
            const cols = toValue(map[i])
            if (!cols) {
              continue
            }

            for (let j = 0; j < cols.length; ++j) {
              const name = toValue(cols[j].name)
              if (has(currentStepForm, name)) {
                set(params, name, get(currentStepForm, name))
              }
            }
          }

          return callCommonBeforeSubmit(params)
          // const commonBeforeSubmitResult =
          //   unref(commonForm.beforeSubmit)?.(params) ?? params
          // if (isPromise(commonBeforeSubmitResult)) {
          //   commonBeforeSubmitResult.then(res => {
          //     callCommonSubmitRequest(res)
          //   })
          // } else {
          //   callCommonSubmitRequest(commonBeforeSubmitResult)
          // }

          // return Promise.resolve()
          //   .then(res => {
          //     return Promise.resolve(unref(commonForm.submitRequest)?.(res))
          //   })
          //   .then(res => {
          //     if (res) {
          //       unref(commonForm.successRequest)?.(params)
          //     }
          //   })
        } else {
          handleNextStep()
        }
      },
      validateFail(e) {
        return unref(funcMap[current.value]?.validateFail)?.(e)
      },
      beforeSubmit(values) {
        return unref(funcMap[current.value]?.beforeSubmit)?.(values) ?? values
      },

      formProps: computed(() => {
        return mergeWithTovalue(
          {},
          toValue(toValue(commonForm).formProps),
          toValue(formPropsMap.value[current.value])
        )
      }),
    }

    function handleNextStep() {
      if (current.value < Object.keys(stepsRef.value).length - 1) {
        current.value++
        nextTick(() => {
          setCurrentStepFieldValues(stepsFormScope.getFormValues())
        })
      }
    }

    function handlePreviousStep() {
      if (current.value > 0) {
        current.value--
      }
    }

    function setCurrentStepFieldValues(values: Forms) {
      const columns = toValue(columnsMap.value[current.value])
      if (columns) {
        const params: any = {}
        for (let i = 0; i < columns.length; ++i) {
          const name = toValue(columns[i].name)
          set(params, name, get(values, name))
        }

        stepsFormScope.setFieldValues(params)
      }
    }

    watch(
      stepsRef,
      value => {
        const tempItems: StepsProps['items'] = []
        const tempColumnsMap: Record<
          number,
          MaybeRefOrGetter<ProFormColumnOptions<Forms, any, any>[]> | undefined
        > = {}
        const tempAction: Record<
          number,
          MaybeRefOrGetter<ProFormActionGroup> | undefined
        > = {}

        let tempFormProps: Record<
          number,
          BuildFormOptionResult['formProps']
        > | null = null

        let initialFormValues: Record<number, any> | null = null

        value.forEach((options, index) => {
          ;(initialFormValues ||= {})[index] = {}

          const {
            description,
            icon,
            status,
            disabled,
            title,
            subTitle,
            onClick,
            columns,
            action,
            // initialValues,
            formProps,
            ...stepForm
          } = options

          tempItems.push({
            description,
            icon,
            status,
            disabled,
            title,
            subTitle,
            onClick,
          })

          tempColumnsMap[index] = columns
          tempAction[index] = action
          ;(tempFormProps ||= {})[index] = formProps

          const stepFormKeys = Object.keys(stepForm)

          for (const key of stepFormKeys) {
            const formValue = (stepForm as any)[key]
            if (isFunction(formValue)) {
              ;(funcMap[index] ||= {})[key as keyof FunctionKeys] = formValue
            } else {
              // @ts-ignore
              buildFormReturn[key as keyof typeof buildFormReturn] = computed(
                () => {
                  return mergeWithTovalue(
                    {},
                    commonForm[key as keyof typeof commonForm],
                    (value as any)[current.value][key]
                  )
                }
              ) as any
            }
          }
        })

        funcMap[value.length] = {
          submitRequest: () =>
            unref(commonForm.submitRequest)?.(resolvedSubmitParams) ?? false,
          beforeSubmit: () =>
            unref(commonForm.beforeSubmit)?.(resolvedSubmitParams) ??
            resolvedSubmitParams,
          validateFail: commonForm.validateFail,
          successRequest: commonForm.successRequest,
        }

        items.value = tempItems
        columnsMap.value = tempColumnsMap
        formPropsMap.value = tempFormProps!
        actionMap.value = tempAction
      },
      { immediate: true }
    )

    return buildFormReturn
  })

  const stepsFormBinding = {
    stepsProps: resolvedStepProps!,
    proFormBinding,
    wrap: resolvedWrap,
  }

  return {
    stepsFormBinding,
  }
}

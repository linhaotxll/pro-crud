import { computed, ref, toRef, toValue, watch } from 'vue'

import { mergeWithTovalue } from '../common'
import { buildForm } from '../ProForm'

import { isFunction, isPromise } from '~/utils'

import type { DataObject } from './../common/interface'
import type {
  BuildStepsFormReturn,
  StepsFormScope,
  StepsOptions,
} from './interface'
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

  const { proFormBinding } = buildForm(scope => {
    const {
      stepsProps,
      steps,
      initialValues: formsInitialValues,
      ...commonForm
    } = options(scope)

    // 步骤列表
    const items = ref<StepsProps['items']>([])

    // 步骤索引映射步骤表单列
    const columnsMap = ref<
      Record<
        number,
        | MaybeRefOrGetter<ProFormColumnOptions<Forms[string], any, any>[]>
        | undefined
      >
    >({})

    // 步骤索引映射表单操作
    const actionMap = ref(
      {} as Record<number, MaybeRefOrGetter<ProFormActionGroup> | undefined>
    )

    // 步骤索引映射表单名称前缀
    const stepsPrefix = ref<Record<number, string>>({})

    // 步骤索引映射表单 Props
    const formPropsMap = ref<
      Record<number, BuildFormOptionResult['formProps']>
    >({})

    // 步骤对象
    const stepsRef = toRef(steps) as Ref<StepsOptions<Forms>>

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
      return current.value === Object.keys(stepsRef.value).length
    }

    let resolvedSubmitParams: any | null = null

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
        return mergeWithTovalue(
          {},
          defaultAction,
          actionMap.value[current.value]
        )
      }),

      initialValues: formsInitialValues,

      submitRequest(values) {
        return funcMap[current.value].submitRequest?.(values) ?? true
      },
      successRequest(values) {
        const result = funcMap[current.value].successRequest?.(values) ?? values
        if (isPromise(result)) {
          return result.then(a)
        } else {
          return a()
        }

        function a() {
          if (!isLast()) {
            ;(resolvedSubmitParams ||= {})[stepsPrefix.value[current.value]] =
              result

            handleNextStep()
            if (isLast()) {
              return scope.submit()
            }
          } else {
            current.value = 0
          }
        }
      },
      validateFail(e) {
        return funcMap[current.value].validateFail?.(e)
      },
      beforeSubmit() {
        const prefix = stepsPrefix.value[current.value]
        const stepForm = prefix
          ? scope.getFieldValue(prefix)
          : resolvedSubmitParams
        return funcMap[current.value].beforeSubmit?.(stepForm) ?? stepForm
      },

      toast: false,

      name: computed(() => {
        return stepsPrefix.value[current.value]
      }),

      formProps: computed(() => {
        const { rules, ...props } = toValue(
          formPropsMap.value[current.value] || {}
        )

        return mergeWithTovalue({}, toValue(commonForm.formProps), props, {
          rules: rules
            ? mergeWithTovalue(
                {},
                {
                  [stepsPrefix.value[current.value]]: rules,
                }
              )
            : undefined,
        })
      }),
    }

    function handleNextStep() {
      if (current.value < Object.keys(stepsRef.value).length) {
        current.value++
      }
    }

    function handlePreviousStep() {
      if (current.value > 0) {
        current.value = current.value - (isLast() ? 2 : 1)
      }
    }

    watch(
      stepsRef,
      value => {
        const tempItems: StepsProps['items'] = []
        const tempColumnsMap: Record<
          number,
          | MaybeRefOrGetter<ProFormColumnOptions<Forms[string], any, any>[]>
          | undefined
        > = {}
        const tempAction: Record<
          number,
          MaybeRefOrGetter<ProFormActionGroup> | undefined
        > = {}

        const stepsKeys = Object.keys(value)

        const tempStepsPrefix: Record<number, string> = {}
        let tempFormProps: Record<
          number,
          BuildFormOptionResult['formProps']
        > | null = null

        let initialFormValues: Record<string, any> | null = null

        stepsKeys
          .sort((a, b) => (value[a].order ?? 0) - (value[b].order ?? 0))
          .forEach((key, index) => {
            const options = value[key]

            ;(initialFormValues ||= {})[key] = {}

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
            tempStepsPrefix[index] = key
            ;(tempFormProps ||= {})[index] = formProps

            const stepFormKeys = Object.keys(stepForm)

            for (const key of stepFormKeys) {
              const formValue = (stepForm as any)[key]
              if (isFunction(formValue)) {
                ;(funcMap[index] ||= {})[key as keyof FunctionKeys] = formValue
              } else {
                buildFormReturn[key as keyof typeof buildFormReturn] = computed(
                  () => {
                    return mergeWithTovalue(
                      {},
                      commonForm[key as keyof typeof commonForm],
                      (value as any)[stepsKeys[current.value]][key]
                    )
                  }
                ) as any
              }
            }
          })

        funcMap[stepsKeys.length] = {
          submitRequest: commonForm.submitRequest,
          beforeSubmit: commonForm.beforeSubmit,
          validateFail: commonForm.validateFail,
          successRequest: commonForm.successRequest,
        }

        items.value = tempItems
        columnsMap.value = tempColumnsMap
        stepsPrefix.value = tempStepsPrefix
        formPropsMap.value = tempFormProps!
      },
      { immediate: true }
    )

    return buildFormReturn
  })

  const stepsFormBinding = {
    stepsProps: resolvedStepProps!,
    proFormBinding,
  }

  return {
    stepsFormBinding,
  }
}

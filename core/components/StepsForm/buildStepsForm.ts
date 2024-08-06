import { computed, ref, toRef, watch } from 'vue'

import { mergeWithTovalue, type DataObject } from '../common'
import { buildForm, BuildFormResult } from '../ProForm'

import type {
  BuildStepsFormReturn,
  StepsFormScope,
  StepsOptions,
} from './interface'
import type { BuildFormOptionResult, ProFormColumnOptions } from '../ProForm'
import type { StepsProps } from 'ant-design-vue'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

export function buildStepsForm<Forms extends DataObject = DataObject>(
  options: (scope: StepsFormScope<Forms>) => BuildStepsFormReturn<Forms>
) {
  let resolvedStepProps: ComputedRef<StepsProps>

  const { proFormBinding } = buildForm(scope => {
    //
    const { stepsProps, steps, initialValues, ...commonForm } = options(scope)
    const commonFormKeys = Object.keys(commonForm)

    const items = ref<StepsProps['items']>([])
    const columnsMap = ref<
      Record<number, MaybeRefOrGetter<ProFormColumnOptions[]> | undefined>
    >({})

    const current = ref(0)

    // 解析 steps props
    resolvedStepProps = computed<StepsProps>(() =>
      mergeWithTovalue({}, stepsProps, {
        items,
        current: current.value,
        'onUpdate:current'(value: number) {
          current.value = value
        },
      })
    )

    const buildFormReturn: BuildFormOptionResult = {
      columns: computed(() => columnsMap.value[current.value]),
    }

    watch(
      toRef(steps) as Ref<StepsOptions<Forms>>,
      value => {
        const tempItems: StepsProps['items'] = []
        const tempColumnsMap: Record<
          number,
          MaybeRefOrGetter<ProFormColumnOptions[]> | undefined
        > = {}

        Object.keys(value)
          .sort((a, b) => (value[a].order ?? 0) - (value[b].order ?? 0))
          .forEach((key, index) => {
            const options = value[key]

            const {
              description,
              icon,
              status,
              disabled,
              title,
              subTitle,
              onClick,
              columns,
              initialValues,
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

            const stepFormKeys = Object.keys(stepForm)
            const resolvedFormKeys = new Set(
              stepFormKeys.concat(commonFormKeys)
            )
            for (const key of resolvedFormKeys) {
              buildFormReturn[key] = computed(() =>
                mergeWithTovalue({}, commonForm[key], stepForm[key])
              )
            }
          })

        items.value = tempItems
        columnsMap.value = tempColumnsMap
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

import { describe, expect, test } from 'vitest'
import { ref } from 'vue'

import { mergeWithTovalue } from '../merge'

describe('merge', () => {
  test('merge nested object', () => {
    const target = { info: { name: 'IconMan' } }
    const source = {
      info: { age: ref(24) },
      score: ref(99),
      exam: ref({ answer: 2 }),
    }
    const result = mergeWithTovalue(target, null, source)

    expect(result).toMatchInlineSnapshot(`
      {
        "exam": {
          "answer": 2,
        },
        "info": {
          "age": 24,
          "name": "IconMan",
        },
        "score": 99,
      }
    `)
  })

  test('merge non object', () => {
    const target = { info: { name: 'IconMan' } }
    const source = {
      info: { age: ref(24) },
      score: ref(99),
      exam: ref({ answer: 2 }),
    }
    const source2 = {
      gender: 'male',
    }
    const result = mergeWithTovalue(target, null, source, source2)

    expect(result).toMatchInlineSnapshot(`
      {
        "exam": {
          "answer": 2,
        },
        "gender": "male",
        "info": {
          "age": 24,
          "name": "IconMan",
        },
        "score": 99,
      }
    `)
  })

  test('merge non object', () => {
    const target = {
      info: { name: 'IconMan' },
      classes: [{ name: 'Classes One' }],
    }
    const source = {
      info: { age: ref(24) },
      score: ref(99),
      exam: ref({ answer: 2 }),
    }
    const source2 = {
      gender: 'male',
      classes: ref([{ name: 'Classes Two' }]),
    }
    const source3 = {
      classes: [{ name: 'Classes Three' }],
    }
    const result = mergeWithTovalue(target, null, source, source2, source3)

    expect(result).toMatchInlineSnapshot(`
      {
        "classes": [
          {
            "name": "Classes Two",
          },
        ],
        "exam": {
          "answer": 2,
        },
        "gender": "male",
        "info": {
          "age": 24,
          "name": "IconMan",
        },
        "score": 99,
      }
    `)
  })

  // test('merge non object', () => {
  //   const ctx = {}
  //   const countFn = vi.fn(() => 0)
  //   const target = {
  //     info: { name: 'IconMan' },
  //   }
  //   const source = {
  //     info: { count: countFn },
  //   }

  //   const result = mergeWithTovalue(target, ctx, source)

  //   expect(result).toMatchInlineSnapshot(`
  //     {
  //       "info": {
  //         "count": 0,
  //         "name": "IconMan",
  //       },
  //     }
  //   `)
  //   expect(countFn).toHaveBeenCalledTimes(1)
  //   expect(countFn).toHaveBeenCalledWith(ctx)
  // })

  test('source is ref', () => {
    const target = {
      info: { name: 'IconMan' },
    }
    const source = ref({
      info: { age: 24 },
    })

    const result = mergeWithTovalue(target, null, source)

    expect(result).toMatchInlineSnapshot(`
      {
        "info": {
          "age": 24,
          "name": "IconMan",
        },
      }
    `)
  })
})

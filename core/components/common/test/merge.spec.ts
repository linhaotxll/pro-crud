import { describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'

import { markIgnoreMerge, merge } from '../merge'

describe('merge', () => {
  test('merge nested object', () => {
    const source1 = { info: { name: 'IconMan' } }
    const source2 = {
      info: { age: ref(24) },
      score: ref(99),
      exam: ref({ answer: 2 }),
    }
    const result = merge({}, source1, source2)

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

  test('merge nested array', () => {
    const source1 = {
      persons: [{ name: 'IconMan', age: 24 }],
    }
    const source2 = {
      persons: ref([{ name: 'Nicholas', age: ref(25) }]),
      infos: [ref({ name: 'Txll' })],
    }
    const result = merge({}, source1, source2)

    expect(result).toMatchInlineSnapshot(`
      {
        "infos": [
          {
            "name": "Txll",
          },
        ],
        "persons": [
          {
            "age": 25,
            "name": "Nicholas",
          },
        ],
      }
    `)
  })

  test('merge function', () => {
    const sayName = vi.fn()
    const sayAge = vi.fn()

    const source1 = {
      sayName,
    }
    const source2 = {
      sayAge: ref(sayAge),
    }
    const result = merge({}, source1, source2)

    expect(result).toMatchInlineSnapshot(`
      {
        "sayAge": [MockFunction spy],
        "sayName": [MockFunction spy],
      }
    `)

    expect(sayName).toHaveBeenCalledTimes(0)
    expect(sayAge).toHaveBeenCalledTimes(0)
  })

  test('merge ignore', () => {
    const source = {
      info: {
        name: 'IconMan',
        age: 24,
      },
    }
    markIgnoreMerge(source.info)
    const result = merge({}, source)

    expect(result.info).toBe(source.info)
  })
})

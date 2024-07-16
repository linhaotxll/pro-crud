import type { Component, MaybeRef, VNodeChild } from 'vue'

export interface CustomRender<Context = any> {
  /**
   * 渲染函数
   */
  render?: MaybeRef<(ctx: Context) => VNodeChild>

  /**
   * 组件名
   */
  is?: string | Component

  /**
   * 组件 Props
   */
  context?: any

  /**
   * 兜底内容
   */
  fallback?: (ctx: Context) => VNodeChild
}

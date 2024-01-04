<template>
  <pro-crud v-bind="proCrudBinding" />
</template>

<script lang="ts" setup>
// import { MenuTypeOptions, MenuTypeEnum } from '~/enums'
import { merge } from 'lodash-es'
import { computed } from 'vue'

import { buildCrud } from '~/index'

import type { ProCrudScope } from '~/index'
// import { useGlobalStore } from '~/store'
// import { generateTree } from '~/utils'

// import type { ProCrudScope } from '@linh-txl/pro-crud'
// import type { Menu } from '~/typings'

defineOptions({ name: 'MenuManager' })

const enum MenuTypeEnum {
  /**
   * 菜单类型（目录）
   */
  TYPE_DIR = 'M',

  /**
   * 菜单类型（菜单）
   */
  TYPE_MENU = 'C',

  /**
   * 菜单类型（按钮）
   */
  TYPE_BUTTON = 'F',
}

// const globalStore = useGlobalStore()

const menuName2Type: Record<any, string> = {
  [MenuTypeEnum.TYPE_DIR]: '目录名称',
  [MenuTypeEnum.TYPE_MENU]: '菜单名称',
  [MenuTypeEnum.TYPE_BUTTON]: '按钮名称',
}

const MenuTypeOptions = [
  { label: '目录', value: MenuTypeEnum.TYPE_DIR },
  { label: '菜单', value: MenuTypeEnum.TYPE_MENU },
  { label: '按钮', value: MenuTypeEnum.TYPE_BUTTON },
]

interface Fields {
  children: string
  id: string
  parentId: string
}

const DefaultFields: Fields = {
  children: 'children',
  id: 'id',
  parentId: 'parentId',
}

function generateTree<T>(data: any[], fields?: Partial<Fields>) {
  const resolvedFields: Fields = merge({}, DefaultFields, fields)
  const { id: _id, parentId, children } = resolvedFields

  const result: T[] = [] // 存放结果集
  const itemMap: Record<number, T> = {} //
  for (const item of data) {
    const id = item[_id]
    const pid = item[parentId]

    if (!itemMap[id]) {
      delete item[children]
      itemMap[id] = item
    }

    const treeItem = itemMap[id]

    if (pid === 0) {
      result.push(treeItem)
    } else {
      // @ts-ignore
      ;(itemMap[pid][children] ||= []).push(treeItem)
    }
  }
  return result
}

async function fetchMenuPageList(_: any) {
  _
  return [
    {
      searchValue: null,
      createBy: null,
      createUser: null,
      createTime: '2023-10-24 16:24:18',
      createTimeStr: null,
      updateBy: null,
      updateUser: null,
      updateTime: null,
      updateTimeStr: null,
      remark: null,
      params: {},
      isDelete: null,
      menuId: 1,
      menuName: '无线网络',
      parentName: null,
      parentId: 0,
      orderNum: 1,
      path: 'wireless-network',
      component: null,
      query: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: 'sys:wifi:dict',
      icon: '#',
      children: [],
    },
    {
      searchValue: null,
      createBy: null,
      createUser: null,
      createTime: '2023-10-24 17:04:37',
      createTimeStr: null,
      updateBy: null,
      updateUser: null,
      updateTime: null,
      updateTimeStr: null,
      remark: null,
      params: {},
      isDelete: null,
      menuId: 4,
      menuName: '视频监控',
      parentName: null,
      parentId: 0,
      orderNum: 1,
      path: 'video-monitor',
      component: null,
      query: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'M',
      visible: '0',
      status: '0',
      perms: 'sys:video:dict',
      icon: '#',
      children: [],
    },
    {
      searchValue: null,
      createBy: null,
      createUser: null,
      createTime: '2023-10-24 16:24:50',
      createTimeStr: null,
      updateBy: null,
      updateUser: null,
      updateTime: null,
      updateTimeStr: null,
      remark: null,
      params: {},
      isDelete: null,
      menuId: 2,
      menuName: '无线网络管理',
      parentName: null,
      parentId: 1,
      orderNum: 1,
      path: '/wireless-network',
      component: '1',
      query: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'sys:wifi:list',
      icon: '#',
      children: [],
    },
    {
      searchValue: null,
      createBy: null,
      createUser: null,
      createTime: '2023-10-24 16:25:11',
      createTimeStr: null,
      updateBy: null,
      updateUser: null,
      updateTime: null,
      updateTimeStr: null,
      remark: null,
      params: {},
      isDelete: null,
      menuId: 3,
      menuName: '无线网络统计分析',
      parentName: null,
      parentId: 1,
      orderNum: 1,
      path: '/wireless-network/statistics',
      component: '1',
      query: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '1',
      status: '0',
      perms: 'sys:wifi:stat',
      icon: '#',
      children: [],
    },
    {
      searchValue: null,
      createBy: null,
      createUser: null,
      createTime: '2023-10-24 17:28:01',
      createTimeStr: null,
      updateBy: null,
      updateUser: null,
      updateTime: null,
      updateTimeStr: null,
      remark: null,
      params: {},
      isDelete: null,
      menuId: 5,
      menuName: '摄像机管理',
      parentName: null,
      parentId: 4,
      orderNum: 1,
      path: '/video-monitor/camera',
      component: '1',
      query: null,
      isFrame: '1',
      isCache: '0',
      menuType: 'C',
      visible: '0',
      status: '0',
      perms: 'sys:camera:list',
      icon: '#',
      children: [],
    },
  ]
}

const should = (
  scope: ProCrudScope<any, any, any, any>,
  conditions: MenuTypeEnum[]
) => {
  const add = scope.addForm.getFieldValue('menuType')
  const addResult = conditions.some(type => add === type)

  if (addResult) {
    return addResult
  }

  const edit = scope.editForm.getFieldValue('menuType')
  const editResult = conditions.some(type => {
    return edit === type
  })

  if (editResult) {
    return editResult
  }

  return false
}

const { proCrudBinding } = buildCrud<any>(scope => {
  return {
    columns: [
      {
        label: '名称',
        name: 'menuName',
        form: { show: false },
      },

      {
        label: '类型',
        name: 'menuType',
        type: 'dict-select',
        search: { show: false },
        form: { col: { span: 24 } },
        dict: {
          data: MenuTypeOptions,
        },
        table: {
          columnProps: { width: '8%' },
        },
      },

      // {
      //   label: '上级菜单',
      //   name: 'parentId',
      //   type: 'dict-tree-select',
      //   table: { show: false },
      //   search: { show: false },
      //   form: {
      //     show: computed(() => {
      //       // debugger
      //       console.log('add: ', JSON.stringify(scope.addForm.getFormValues()))
      //       const addMenuType = scope.addForm.getFieldValue('menuType')
      //       if (
      //         addMenuType === MenuTypeEnum.TYPE_DIR ||
      //         addMenuType === MenuTypeEnum.TYPE_BUTTON
      //       ) {
      //         return true
      //       }

      //       console.log(
      //         'edit: ',
      //         JSON.stringify(scope.editForm.getFormValues())
      //       )
      //       const editMenuType = scope.editForm.getFieldValue('menuType')
      //       if (
      //         editMenuType === MenuTypeEnum.TYPE_DIR ||
      //         editMenuType === MenuTypeEnum.TYPE_BUTTON
      //       ) {
      //         return true
      //       }
      //       return false
      //     }),
      //     // show: computed(() =>
      //     //   should(scope, [MenuTypeEnum.TYPE_MENU, MenuTypeEnum.TYPE_BUTTON])
      //     // ),
      //     fieldProps: {
      //       useData: () => useMenuTree({ immediate: true }),
      //       treeDefaultExpandAll: true,
      //       fieldNames: {
      //         children: 'children',
      //         label: 'label',
      //         value: 'id',
      //       },
      //     },
      //   },
      // },

      {
        label: computed(
          () =>
            menuName2Type[scope.addForm.getFieldValue('menuType')] ||
            menuName2Type[scope.editForm.getFieldValue('menuType')]
        ),
        name: 'menuName',
        table: { show: false },
        search: { show: false },
      },

      {
        label: '显示排序',
        name: 'orderNum',
        type: 'digit',
        search: { show: false },
        form: {
          show: computed(() =>
            should(scope, [MenuTypeEnum.TYPE_DIR, MenuTypeEnum.TYPE_MENU])
          ),
        },
        table: {
          columnProps: { width: '6%' },
        },
      },

      {
        label: '权限',
        name: 'perms',
        search: { show: false },
        table: {
          columnProps: { width: '14%' },
        },
      },

      {
        label: '组件路径',
        name: 'component',
        table: { show: false },
        search: { show: false },
        form: {
          show: computed(() => should(scope, [MenuTypeEnum.TYPE_MENU])),
        },
      },

      {
        label: '路由地址',
        name: 'path',
        search: { show: false },
        table: { show: false },
        form: {
          tooltip:
            '访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头',
          show: computed(() =>
            should(scope, [MenuTypeEnum.TYPE_DIR, MenuTypeEnum.TYPE_MENU])
          ),
        },
      },

      {
        label: '外链打开方式',
        name: 'openType',
        search: { show: false },
        table: { show: false },
        form: {
          tooltip: '外链路由地址必须以`http(s)://`开头',
          show: computed(() => should(scope, [MenuTypeEnum.TYPE_MENU])),
        },
        type: 'dict-select',
        dict: {
          data: [
            { label: '新标签页', value: '1' },
            { label: 'ifame内嵌', value: '2' },
          ],
        },
      },

      {
        label: '是否是后台页面',
        name: 'layout',
        type: 'dict-select',
        dict: {
          data: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
        },
        search: { show: false },
        table: { show: false },
        form: {
          tooltip: '选择否将是一个新页面，不包含左侧和顶部内容',
          show: computed(() => should(scope, [MenuTypeEnum.TYPE_MENU])),
        },
      },

      // {
      //   label: '显示状态',
      //   name: 'visible',
      //   type: 'dict-select',
      //   dict: {
      //     fetchData: fetchMenuVisibleStatus,
      //     labelField: 'dictLabel',
      //     valueField: 'dictValue',
      //   },
      //   form: {
      //     tooltip: '选择隐藏将不会出现在菜单栏，但仍然可以访问',
      //     show: computed(() => should(scope, [MenuTypeEnum.TYPE_MENU])),
      //   },
      //   table: { show: false },
      // },

      {
        label: '状态',
        name: 'status',
        type: 'dict-select',
        dict: {
          data: [
            { labelField: '启用', valueField: '1' },
            { labelField: '停用', valueField: '0' },
          ],
          labelField: 'labelField',
          valueField: 'valueField',
        },
        form: {
          tooltip: '选择停用将不会出现在菜单栏，也不能被访问',
          show: computed(() =>
            should(scope, [MenuTypeEnum.TYPE_DIR, MenuTypeEnum.TYPE_MENU])
          ),
        },
        table: {
          columnProps: { width: '8%' },
        },
      },

      {
        label: '创建时间',
        name: 'createTime',
        search: { show: false },
        form: { show: false },
        table: {
          columnProps: { width: '15%' },
        },
      },
    ],

    addForm: {
      initialValues: {
        menuType: MenuTypeEnum.TYPE_DIR,
        status: '1',
        orderNum: 1,
      },
    },

    form: {
      col: { span: 24 },
      formProps: {
        rules: {
          menuType: { required: true, message: '请选择类型' },
          menuName: { required: true, message: '请填写名称' },
          orderNum: { required: true, message: '请填写排序值' },
          perms: { required: true, message: '请填写权限' },
          visible: { required: true, message: '请选择显示状态' },
          status: { required: true, message: '请选择状态' },
          layout: { required: true, message: '请选择是否是后台页面' },
          path: { required: true, message: '请输入路由地址' },
          component: { required: true, message: '请填写组件路径' },
        },
        labelCol: { style: { width: '150px' } },
      },
    },

    // search: {
    //   col: { span: 4 },
    // },

    table: {
      tableProps: { pagination: false, rowKey: 'menuId' },
    },

    viewForm: { show: false },

    action: {
      actions: {
        view: { show: false },
      },
    },

    fetchPaginationData: async params => {
      const menus = await fetchMenuPageList({ query: params.query })
      return {
        rows: generateTree(menus, { id: 'menuId' }),
        total: 1,
      }
    },
    // addRequest: form => createMenu({ body: form }),
    // editRequest: form => updateMenu({ body: form }),
    // deleteRequest: ctx => deleteMenu({ params: `${ctx.record.menuId}` }),
  }
})
</script>

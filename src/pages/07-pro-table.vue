<template>
  <pro-crud class="abc" style="max-height: 100%" v-bind="proCrudBinding" />
</template>

<script lang="ts" setup>
import { buildCrud } from '~/index'

defineOptions({ name: 'ParamsManager' })

const { proCrudBinding } = buildCrud<any>(() => {
  // })

  return {
    columns: [
      {
        label: '参数主键',
        name: 'configId',
        search: { show: false },
        form: { show: false },
        table: { columnProps: { width: 100 } },
      },
      {
        label: '参数名称',
        name: 'configName',
        table: { columnProps: { width: 250 } },
      },
      {
        label: '参数键名',
        name: 'configKey',
        table: { columnProps: { width: 100 } },
      },
      {
        label: '参数键值',
        name: 'configValue',
        search: { show: false },
        table: { columnProps: { width: 200 } },
      },
      {
        label: '系统内置',
        name: 'configType',
        type: 'dict-select',
        table: { columnProps: { width: 100 } },
        dict: {
          data: [],
          // fetchData: fetchSystemBuiltInDictioanry,
          labelField: 'dictLabel',
          valueField: 'dictValue',
        },
      },
      {
        label: '创建时间',
        name: 'createTime',
        table: { columnProps: { width: 200 } },
        search: { show: false },
        form: { show: false },
      },
      {
        label: '备注',
        name: 'remark',
        search: { show: false },
        type: 'textarea',
        form: { col: { span: 24 } },
        table: { columnProps: { width: 250 } },
      },
    ],

    form: {
      col: { span: 12 },
      formProps: {
        labelCol: { style: { width: '100px' } },
        rules: {
          configName: { required: true, message: '请填写参数名称' },
          configKey: { required: true, message: '请填写参数键名' },
          configValue: { required: true, message: '请填写参数键值' },
          configType: { required: true, message: '请选择系统内置类型' },
          remark: { required: true, message: '请填写备注' },
        },
      },
    },

    table: {
      tableProps: { rowKey: 'configId' },
      toolbar: {
        actions: {
          // add: { show: computed(() => access.canAddParamsConfig) },
        },
      },
    },

    action: {
      actions: {
        view: { show: false },
        // edit: { show: computed(() => access.canEditParamsConfig) },
        // delete: { show: computed(() => access.canDeleteParamsConfig) },
      },
    },

    viewForm: { show: false },

    fetchPaginationData: async () => {
      const total = 20
      return {
        total,
        rows: Array.from({ length: total }).fill({
          createBy: null,
          createUserName: 'admin',
          createTime: '2023-11-02 16:04:31',
          updateBy: null,
          updateUserName: 'admin',
          updateTime: '2023-11-02 16:06:57',
          remark: '小程序后台域名',
          configId: 6,
          configName: '小程序后台域名',
          configKey: 'SYS_MP_ADMIN_HOST',
          configValue: 'http://www.ruyiwan.com:8801',
          configType: 'Y',
        }),
        // rows: [

        //   {
        //     createBy: null,
        //     createUserName: null,
        //     createTime: '2022-04-28 09:17:04',
        //     updateBy: null,
        //     updateUserName: 'admin',
        //     updateTime: '2023-11-02 16:09:59',
        //     remark: '初始化密码 123456',
        //     configId: 2,
        //     configName: '用户管理-账号初始密码',
        //     configKey: 'SYS_USER_INIT_PASSWORD',
        //     configValue: '1234567',
        //     configType: 'Y',
        //   },
        // ],
        code: 200,
        msg: '查询成功',
      }
    },
  }
})
</script>

<style scoped>
.abc :deep(.ant-table-body::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>

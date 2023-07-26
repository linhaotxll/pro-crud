<template>
  <pre>{{ values }}</pre>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import { ProFormValueKey } from '../../lib/components/ProForm'

const values = inject(ProFormValueKey)
</script>

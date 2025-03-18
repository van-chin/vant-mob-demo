<script setup lang="ts">
import { ListTable, VTable } from '@visactor/vue-vtable'

import type { VzFormSchema } from '@/types/form-designer'

import data from './data/BO_HR_OutWorkBill.json'

const list = ref<VzFormSchema>(data)

console.info('list =>', list)



</script>

<template>
  <div>
    <FormRenderer :data="list" />
  </div>


</template>

<route lang="json5">
{
  name: 'forms',
  meta: {
    title: '表单渲染',
    i18n: 'menus.formRender'
  },
}
</route>

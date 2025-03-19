<script setup lang="ts">
import { ListTable, VTable } from '@visactor/vue-vtable'

import { ref } from 'vue'

interface VzFormTableProps {
  columns: Record<string, any>[]
}

defineOptions({
  name: 'VzFormTable',
})

const { columns } = defineProps<VzFormTableProps>()

const modelValue = defineModel<any[]>('value', {
  default: [
    // {
    //   cpercode_cc: '1234567890123456789012345678901201',
    //   cpername_cc: '小六',
    //   do_hr_outworkbills_per_id: '730656059597573734401',
    // },
    // {
    //   cpercode_cc: '1234567890123456789012345678901202',
    //   cpername_cc: '张三',
    //   do_hr_outworkbills_per_id: '730656059597573734402',
    // },
  ],
})

const currentTheme = VTable.themes.DEFAULT.extends({
  defaultStyle: {
    padding: [8, 8, 8, 8],
    textAlign: 'center',
    fontSize: 12,
  },
  headerStyle: { color: '#1B1F23', bgColor: '#EEF1F5', fontSize: 14, textAlign: 'center', padding: [8, 12, 8, 12] },
})

const active = ref(0)
// *出差人编码			*出差人名称

const listTableOptions = ref({
  header: [

  ],
  records: [

  ],
  theme: currentTheme,
  autoFillWidth: true,
  // autoFillHeight: true,

  // autoWrapText: true,
  // heightMode: 'autoHeight',
  frozenColCount: 1,
  // theme: {
  //   headerStyle: {
  //     backgroundColor: '#f5f5f5',
  //   },
  // },
  columnResizeMode: 'header',
  rowSeriesNumber: {
    title: '#',
    width: '50',
    // headerStyle: {
    //   textAlign: 'center',
    // },
    // style: {
    //   textAlign: 'center',
    // },
  },
});

(async function init() {
  console.info('init columns=>', columns)
  console.info('init modelValue=>', modelValue.value)
  let tmpHeaders = []
  columns.forEach((column) => {
    tmpHeaders.push({
      field: column.key,
      caption: column.title,
      // 是否隐藏列
      hide: column.key === 'do_hr_outworkbills_per_id',
    })
  })

  listTableOptions.value.header = tmpHeaders
  listTableOptions.value.records = modelValue.value
})()
</script>

<template>
  <div class="h-200 min-h-200">
    <ListTable :options="listTableOptions" />
    <!-- <ListTable :options="tableOptions" /> -->
  </div>
</template>

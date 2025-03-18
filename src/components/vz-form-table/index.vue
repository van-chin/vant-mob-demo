<script setup lang="ts">
import { ListTable, VTable } from '@visactor/vue-vtable';

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

const businessTravellerTableOptions = {
  header: [
    {
      field: '0',
      caption: '出差人编码',
      // width: '100',

    },
    {
      field: '1',
      caption: '出差人名称',
      // width: '100',
      // width: '100',
    },

  ],
  records: Array.from({ length: 8 }).fill(['100003', '湖南蓝海']),
  theme: currentTheme,
  autoFillWidth: true,
  autoFillHeight: true,

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
}

const tableOptions = {
  header: [
    {
      field: '0',
      caption: '任务内容',
      width: '200',
      headerStyle: {
        textAlign: 'center',

      },
    },
    {
      field: '1',
      caption: '出发地',
      // width: '100',
    },
    {
      field: '2',
      // width: '100',
      caption: '目的地',
    },
    {
      field: '3',
      // width: '100',
      caption: '目的地区',
    },
    {
      field: '4',
      width: '90',
      caption: '开始日期',
    },
    {
      field: '5',
      width: '90',
      caption: '结束日期',
    },
    {
      field: '6',
      width: '130',
      caption: '自备交通工具',
    },
    {
      field: '6',
      // width: '90',
      caption: '自备车',
    },
    {
      field: '6',
      // width: '120',
      caption: '往返里程',
    },
    {
      field: '6',
      // width: '100',
      caption: '交通工具',
    },
  ],
  records: Array.from({ length: 10 }).fill(['确保高随内容动态调整确保行高随内容动态调整', '湖南蓝海', '四川蓝海', '温江区', '2025-03-12 23:17:22', '2025-04-12 23:17:22']),
  theme: currentTheme,
  autoWrapText: true,
  heightMode: 'autoHeight',
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
    headerStyle: {
      textAlign: 'center',
    },
    style: {
      textAlign: 'center',
    },
  },
}


</script>

<template>
 <div class="">

  <div class="p-2 mt-2">
<van-tabs v-model:active="active" shrink>
      <van-tab title="出差人明细">
        <div class="mt-4 h-424px p-2">
          <ListTable :options="businessTravellerTableOptions" />
        </div>
      </van-tab>
      <van-tab title="出差任务内容">
        <div class="mt-4 h-400px p-2">
          <ListTable :options="tableOptions" />
        </div>
      </van-tab>
    </van-tabs>
  </div>


 </div>
</template>

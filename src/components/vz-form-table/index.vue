<!-- eslint-disable prefer-const -->
<script setup lang="ts">
import { ListTable, VTable } from '@visactor/vue-vtable';
import { useStyle } from '@/hooks';

import { getAllSysEnums, getEnumsByRuleCaption, getEnumsByRuleName, getTokenJwtkeyAcc } from '@/composables/sys-enums';
//
import { omit } from 'es-toolkit/compat';
import { closeToast, showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast, showToast } from 'vant';

import { getCurrentInstance, reactive, ref, useTemplateRef, watch } from 'vue';

import snowflakeId from 'snowflake-id'

defineOptions({
  name: 'VzFormTable',
})
const { columns } = defineProps<VzFormTableProps>();
const emits = defineEmits<{
  change: [
			data: any,
  ]
}>();
// eslint-disable-next-line new-cap
const snowflake = new snowflakeId()

const { prefixCls } = useStyle('form-table');

const listTableElRef = useTemplateRef('list-table-el');
const {

  DBLCLICK_CELL,

} = VTable.ListTable.EVENT_TYPE;

const checkedDataIds = ref([]);

interface VzFormTableProps {
  columns: Record<string, any>[]
}

const currentInstance = getCurrentInstance()

const modelValue = defineModel<any[]>({
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
});

const currentTheme = VTable.themes.DEFAULT.extends({
  defaultStyle: {
    padding: [8, 8, 8, 8],
    textAlign: 'center',
    fontSize: 12,
  },
  headerStyle: { color: '#1B1F23', bgColor: '#EEF1F5', fontSize: 14, textAlign: 'center', padding: [8, 12, 8, 12] },
});

const active = ref(0)
// *出差人编码			*出差人名称

const listTableOptions = ref({
  header: [

  ],
  theme: currentTheme,
  autoFillWidth: true,
  // autoFillHeight: true,

  // autoWrapText: true,
  // heightMode: 'autoHeight',
  frozenColCount: 1,
  // rightFrozenColCount: 1,
  // theme: {
  //   headerStyle: {
  //     backgroundColor: '#f5f5f5',
  //   },
  // },
  columnResizeMode: 'header',
  rowSeriesNumber: {
    title: '#',
    width: '55',
    dragOrder: false,
    field: 'dtcrkId',
    // format: (index) => {
    //   console.log(index);
    //   return '1';
    // },
    cellType: 'checkbox',
    // headerStyle: {
    //   textAlign: 'center',
    // },
    // style: {
    //   textAlign: 'center',
    // },
  },
});

const initDataStructure = ref({});

const rowPopuping = ref(false);

//
const rowPopupData = ref({
  position: {
    col: 0,
    row: 0,
  },
  action: {

  },
  data: {},

});

// 自定义 客户端口 data-table-row-key
// const dataTableClientRowKey = ref('dtcrkId');
const dataTableClientRowKey = 'dtcrkId';
// 服务数据 data-table-row-primary-key
const dataTableRowServeKey = ref('unknowned');

const dataTableRecords = ref([]);

// 行 编辑 表单项 组件
const rowColumnsFormItems = ref([]);

// const tokenJwtkeyAcc = useStorage('TOKEN-JWTKEY-ACC', { token: '', jwtkey: '', caccid: '' });
// const tokenJwtkeyAcc = useStorage('TOKEN-JWTKEY-ACC', { token: '', jwtkey: '', caccid: '' });
//

function emitEventHandler(field: string, event: string, params: any) {
  const eo = `${field}-${event}`
  currentInstance.emitsOptions[eo] = null
  // console.log('🚀 ~ file: index.vue:207 ~ emitEventHandler ~ eo:', eo)
  // console.log('🚀 ~ file: index.vue:207 ~ emitEventHandler ~ params:', params)

  // console.info('rowPopupData.value =>', rowPopupData.value);
  emits(eo, params)
  emits('change', { field, fieldValue: rowPopupData.value.data[field], rowIndex: rowPopupData.value.position.row, rowData: rowPopupData.value.data });
}

function onFieldEvents(field: string, params: any) {
  // console.log('🚀 ~ file: index.vue:212 ~ onFieldEvents ~ params:', params)
  const { columnField, event } = params
  const eo = `${field}-${columnField}-${event}`
  emits(eo, params.params)
}

// 处理表单事件 emitsEvents

function parsesEvents() {
  // console.group('解析列字段组件的事件 =>')

  // console.info('rowColumnsFormItems =>', rowColumnsFormItems.value);

  rowColumnsFormItems.value.forEach((item) => {
    if (item.visible === true) {
      // console.info('item =>', item);
      if (item.component) {
        console.info('item.component  =>', item.component);
        if (item.component.vant.events) {
          let emitsEvents = {}
          for (const key in item.component.vant.events) {
            emitsEvents[key] = (...args: any) => {
              let params = reactive({})
              item.component.vant.events[key].map((pkey: string, index: number) => {
                params[pkey] = args[index]
              });
              // console.info('item =>', item);
              emitEventHandler(item.key, key, params);
            }
          }
          item.component.vant.emitsEvents = emitsEvents
          console.info('parseEvents emitsEvents =>', emitsEvents);
        }
      }
    }
  });



  // console.groupEnd();
}

// getAallSysEnums
(async function init() {
  // console.info('tokenJwtkeyAcc =>', getTokenJwtkeyAcc());
  // console.info('sysEnums all =>', getAllSysEnums());

  // console.info('getEnumsByRuleName =>', getEnumsByRuleName('EnmOutCooutry'));

  // console.info('getEnumsByRuleCaption =>', getEnumsByRuleCaption('出差国家'));

  //

  const tmpHeaders = [];
  columns.forEach((column) => {
    // console.log('column =>', column);
    rowColumnsFormItems.value.push(column);
    if (column.primaryKey) {
      dataTableRowServeKey.value = column.key;
    }

    initDataStructure.value[column.key] = '';
    tmpHeaders.push({
      field: column.key,
      caption: column.title,
      // 是否隐藏列
      hide: !column.visible,
    })
  });

  // 解析列字段组件的事件

  parsesEvents();

  // 构造表格数据

  let dataTableTmpRecords = [];
  modelValue.value.forEach((item) => {
    let tmpRecord = { ...item }
    // tmpRecord[dataTableClientRowKey] = item[dataTableRowServeKey.value];
    tmpRecord[dataTableClientRowKey] = snowflake.generate();
    dataTableTmpRecords.push(tmpRecord);
  })

  dataTableRecords.value = dataTableTmpRecords;
  console.info('dataTableRecords.value =>', dataTableRecords.value);

  // let addedData = { ...initDataStructure.value };
  // addedData[dataTableClientRowKey] = snowflake.generate();
  // dataTableRecords.value.push(addedData);

  // 增加操作列

  // tmpHeaders.push({
  //   field: 'operation',
  //   caption: '操作',
  //   width: 60,
  //   icon: [
  //     'addition',
  //     'delete',
  //   ],
  //   headerStyle: {
  //     textAlign: 'center',
  //   },
  // });

  listTableOptions.value.header = tmpHeaders;
  // listTableOptions.value.records = modelValue.value;
})();

const toolbarButtons = ref([
  {
    id: 'tbb-1001',
    code: 'add',
    text: '添加',
    size: 'mini',
    icon: 'add',
    color: '#07c160',
    visible: true,
  },
  {
    id: 'tbb-1002',
    code: 'edit',
    text: '编辑',
    size: 'mini',
    icon: 'edit',
    color: '#1989fa',
    disabled: true,
    visible: true,
  },
  {
    id: 'tbb-1003',
    code: 'delete',
    text: '删除',
    size: 'mini',
    icon: 'delete',
    color: '#f5222d',
    disabled: true,
    visible: true,
  },
  {
    id: 'tbb-1004',
    code: 'export',
    text: '导出',
    size: 'mini',
    icon: 'export',
    color: '#07c160',
    visible: false,
  },
]);

function setRecordsValue() {
  listTableOptions.value.records = modelValue.value
}

function onToolbarAction(item) {
  console.info('onToolbarAction =>', item)
  switch (item.code) {
    case 'add':
      additionRow();
      break
    case 'edit':
      // rowPopuping.value = true;
      editRow();
      break;
    case 'delete':
      deleteRow();
      break
    case 'export':
      break;
  }
}

function setRowPopupData(data, actionCode, row, col, popup = true) {
  rowPopupData.value.data = data;
  rowPopupData.value.action = toolbarButtons.value.find(item => item.code === actionCode);
  rowPopupData.value.position.row = row;
  rowPopupData.value.position.col = col;

  console.info('setRowPopupData =>', rowPopupData.value);
  rowPopuping.value = popup;
}

function editRow() {
  rowPopuping.value = true;
}

function additionRow() {
  let addedData = { ...initDataStructure.value };
  addedData[dataTableClientRowKey] = snowflake.generate();
  dataTableRecords.value.push(addedData);
  setRowPopupData(addedData, 'add', dataTableRecords.value.length, 0);

}

function deleteRow() {
  showConfirmDialog({
    title: '确认提示',
    message:
    '确认要删除所选数据么?',
  })
    .then(() => {
      checkedDataIds.value.forEach((id) => {
        const index = dataTableRecords.value.findIndex(item => item[dataTableClientRowKey] === id);
        console.info('删除行 => index', index);
        dataTableRecords.value.splice(index, 1);
      })
    })
    .catch(() => {
    // on cancel
    });

}

// onPopupAdd onPopupDelete onPopupPrevious onPopupNext

function onPopupAdd() {
  console.log('onPopupAdd => rowPopupData', rowPopupData.value);
  additionRow();
}

function onPopupDelete() {
  if (dataTableRecords.value.length === 1) {
    showToast('最后一行不能删除!');
    return
  }

  showConfirmDialog({
    title: '确认提示',
    message:
    '确认要删除当前数据么?',
  })
    .then(() => {
      const findedIndex = dataTableRecords.value.findIndex(item => item[dataTableClientRowKey] === rowPopupData.value.data[dataTableClientRowKey]);
      dataTableRecords.value.splice(findedIndex, 1);
      let currentIndex = findedIndex < dataTableRecords.value.length ? findedIndex : 0;
      if (dataTableRecords.value.length > 1 && currentIndex === 0) {
        currentIndex = dataTableRecords.value.length - 1;
      }
      setRowPopupData(dataTableRecords.value[currentIndex], 'edit', currentIndex + 1, 0);
    })
    .catch(() => {
    // on cancel
    });

}

function onPopupPrevious() {
  if (dataTableRecords.value.length === 1) {
    showToast('当前已经是第一行数据了!');
    return;
  }
  const findedIndex = dataTableRecords.value.findIndex(item => item[dataTableClientRowKey] === rowPopupData.value.data[dataTableClientRowKey]);

  if (findedIndex === 0) {
    showToast('当前已经是第一行数据了!');
    return
  }
  setRowPopupData(dataTableRecords.value[findedIndex - 1], 'edit', findedIndex, 0);
}

function onPopupNext() {
  if (dataTableRecords.value.length === 1) {
    showToast('当前已经是最后一行数据了!');
    return
  }
  const findedIndex = dataTableRecords.value.findIndex(item => item[dataTableClientRowKey] === rowPopupData.value.data[dataTableClientRowKey]);

  if (dataTableRecords.value.length - 1 === findedIndex) {
    showToast('当前已经是最后一行数据了!');
    return
  }
  setRowPopupData(dataTableRecords.value[findedIndex + 1], 'edit', findedIndex + 2, 0);
}

function onDblClickCell(args) {
  console.log('onDblClickCell =>', args);
  const { field, col, row, targetIcon, originData, dataValue } = args;

  if (field !== '_vtable_rowSeries_number') {
    // 非序号列 双击编辑

    setRowPopupData(originData, 'edit', row, col);

  }
}

function onClickCell(args) {
  const { field, col, row, targetIcon, originData, dataValue } = args;

  if (field === '_vtable_rowSeries_number') {
    const checkboxStates = listTableElRef.value.vTableInstance.getCheckboxState();
    let checkedQuantity = 0;
    const checkedIds = [];
    checkboxStates.forEach((state, index) => {
      console.log('state =>', state);
      if (state._vtable_rowSeries_number) {
        checkedQuantity++;
        checkedIds.push(dataTableRecords.value[index][dataTableClientRowKey]);
      }
    });

    if (checkedQuantity === 1) {
      // fixed row 和  数据不对 需要根据数据去查找
      dataTableRecords.value.forEach((item, index) => {
        if (item[dataTableClientRowKey] === checkedIds[0]) {
          setRowPopupData(item, 'edit', index + 1, col, false);
        }
      });
    }
    else {
      rowPopupData.value = {
        position: {
          col: 0,
          row: 0,
        },
        action: {

        },
        data: {},

      };
    }

    checkedDataIds.value = checkedIds;

    toolbarButtons.value.forEach((item) => {
      if (item.code === 'delete') {
        item.disabled = checkedQuantity === 0;
      }
      if (item.code === 'edit') {
        item.disabled = checkedQuantity !== 1
      }
    });

  }
}

function onRowEditSave() {
  console.log('onDblClickCell');
  rowPopuping.value = false;
}

function onFailed(errorInfo) {
  console.log('failed', errorInfo)
}

function onPopupClose() {
  rowPopupData.value = {
    position: {
      col: 0,
      row: 0,
    },
    action: {

    },
    data: {},

  };
}

watch(() => dataTableRecords.value, (newDataTableRecords) => {
  const temModelValue = [];
  newDataTableRecords.forEach((item) => {
    temModelValue.push(omit(item, [dataTableClientRowKey]));
  })
  modelValue.value = temModelValue;
}, {
  deep: true,
})
//
</script>

<template>
  <div :class="`${prefixCls}`">
    <div :class="`${prefixCls}-top-toolbar px-2 py-4 flex items-center justify-between`">
      <div :class="`${prefixCls}-top-toolbar-left`">
        <van-space>
          <template v-for="(item) in toolbarButtons">
            <van-button v-if="item.visible" v-bind="item" :key="item.id" @click="onToolbarAction(item)" />
          </template>
        </van-space>
      </div>
      <div :class="`${prefixCls}-top-toolbar-right`">
        &nbsp;
      </div>
    </div>

    <!-- <div>
      rowPopupData:
      <div>{{ rowPopupData }}</div>
    </div> -->

    <!-- <div>
      dataTableRowServeKey:
      <div>{{ dataTableRowServeKey }}</div>
    </div> -->

    <!-- <div>
      dataTableRecords:
      <div>{{ dataTableRecords }}</div>
    </div>

    <div>
      modelValue:
      <div>{{ modelValue }}</div>
    </div> -->

    <div :class="`${prefixCls}-gird h-400 min-h-400 w-full`">
      <ListTable
        ref="list-table-el"
        :class="`${prefixCls}-gird-list-table`"
        :options="listTableOptions"
        :records="dataTableRecords"
        @on-dbl-click-cell="onDblClickCell"
        @on-click-cell="onClickCell"
      />

    <!-- <ListTable :options="tableOptions" /> DBLCLICK_CELL -->
    </div>
    <!-- {{ modelValue }} -->
    <van-popup
      v-model:show="rowPopuping"
      teleport="body"
      position="bottom"
      :style="{ height: '100%', backgroundColor: '#f7f8fa' }"
      @close="onPopupClose"
    >
      <div :class="`${prefixCls}-row-popup h-full w-full flex flex-col`">
        <div>
          <van-nav-bar
            title=""
            left-text="返回"
            left-arrow
            right-text="关闭"
            @click-left="onRowEditSave"
            @click-right="onRowEditSave"
          >
            <template #right>
              <van-icon name="cross" size="18" />
            </template>
            <template #title>
              {{ rowPopupData.action.text }} 第 {{ rowPopupData.position.row }} 行
            </template>
          </van-nav-bar>
        </div>
        <div class="min-h-100px flex-1 overflow-hidden">
          <div class="h-full w-full overflow-y-auto px-2 py-4 pb-70px">
            <div class="p-2">

              <van-form @failed="onFailed">
                <van-cell-group inset>
                  <template v-for="(item) in rowColumnsFormItems">
                    <template v-if="item.primaryKey === true">

                      <van-field
                        v-show="item.visible"
                        :key="item.key"
                        v-model="rowPopupData.data[item.key]"
                        :label="item.title"
                      />
                    </template>
                    <template v-else>

                      <template v-if="item.component.vant.name === 'VzFormReferPicker'">
                          <component
                            :is="item.component.vant.name"
                            v-bind="item.component.vant.props"
                            v-show="item.visible"
                            :key="item.key"
                            v-model="rowPopupData.data"
                            v-on="item.component.vant.emitsEvents || {}"
                          />
                      </template>

                      <template v-else>
                         <component
                          :is="item.component.vant.name"
                          v-bind="item.component.vant.props"
                          v-show="item.visible"
                          :key="item.key"
                          v-model="rowPopupData.data[item.key]"
                          v-on="item.component.vant.emitsEvents || {}"
                        />
                      </template>



                    </template>
                  </template>


                </van-cell-group>
              </van-form>
            </div>
          </div>
        </div>
        <div class="">
          <van-action-bar>
            <van-action-bar-icon icon="add-o" text="增加" @click="onPopupAdd" />
            <van-action-bar-icon icon="delete-o" text="删除" @click="onPopupDelete" />
            <van-action-bar-icon icon="arrow-left" text="上一行" @click="onPopupPrevious" />
            <van-action-bar-icon icon="arrow" text="下一行" @click="onPopupNext" />

            <van-action-bar-button type="danger" text="立即保存" @click="onRowEditSave" />
          </van-action-bar>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-table';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
  &-top-toolbar {
    &-left {
      // border: 2px solid red;
    }
    &-right {
      // border: 2px solid red;
    }
  }
}
</style>

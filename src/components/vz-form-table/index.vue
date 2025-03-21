<script setup lang="ts">
import { ListTable, VTable } from '@visactor/vue-vtable';
import { useStyle } from '@/hooks';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef } from 'vue';


import snowflakeId from "snowflake-id";

const snowflake = new snowflakeId();

defineOptions({
  name: 'VzFormTable',
});

const { columns } = defineProps<VzFormTableProps>();

const { prefixCls } = useStyle('form-table');

const listTableElRef = useTemplateRef('list-table-el');
const {

  DBLCLICK_CELL,

} = VTable.ListTable.EVENT_TYPE;


const checkedDataIds = ref([]);

interface VzFormTableProps {
  columns: Record<string, any>[]
}

VTable.register.icon('addition', {
  type: 'svg',
  // svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/edit.svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/edit.svg',
  width: 20,
  height: 20,
  name: 'addition',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  cursor: 'pointer',
});

VTable.register.icon('delete', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/delete.svg',
  width: 20,
  height: 20,
  name: 'delete',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  marginLeft: 5,
  cursor: 'pointer',
});

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
    field: 'do_hr_outworkbills_per_id',
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

(async function init() {
  const tmpHeaders = [];
  columns.forEach((column) => {
    // console.log('column =>',column);
    initDataStructure.value[column.key] = '';
    tmpHeaders.push({
      field: column.key,
      caption: column.title,
      // 是否隐藏列
      hide: !column.visible,
    })
  });

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
      additionRow(0, 0, {}, undefined);
      break;
    case 'edit':
      break;
    case 'delete':
      deleteRow();
      break;
    case 'export':
      break;
  }
}

function additionRow(col, row, originData, dataValue) {
  // console.info('添加行 => col', col);
  // console.info('添加行 => row', row);
  // console.info('添加行 => originData', originData);
  // console.info('添加行 => dataValue', dataValue);
  //
  let addedData = {...initDataStructure.value };
  addedData.do_hr_outworkbills_per_id = snowflake.generate();
  modelValue.value.push(addedData);
  rowPopuping.value = true;
}

function deleteRow() {
  // console.info('删除行 => col', col);
  // console.info('删除行 => row', row);
  // console.info('删除行 => originData', originData);
  // console.info('删除行 => dataValue', dataValue);

  checkedDataIds.value.forEach((id) => {
    const index = modelValue.value.findIndex((item) => item.do_hr_outworkbills_per_id === id);
    console.info('删除行 => index', index);
    modelValue.value.splice(index, 1);
  });


  // modelValue.value.splice(row - 1, 1);
  // listTableOptions.value.records.splice(row - 1, 1);
  // console.info('删除行 => listTableOptions.value.records', listTableOptions.value.records);
  // setRecordsValue();
}

function onDblClickCell(e) {
  console.log('onDblClickCell', e)
}

function onClickCell(args) {
  const { field, col, row, targetIcon, originData, dataValue } = args;

  if (field === '_vtable_rowSeries_number') {

    const checkboxStates = listTableElRef.value.vTableInstance.getCheckboxState();
    let checkedQuantity = 0;
    const selectedIds = [];
    checkboxStates.forEach((state,index) => {
      console.log('state =>', state);
      if(state._vtable_rowSeries_number) {
        checkedQuantity++;
        selectedIds.push(modelValue.value[index].do_hr_outworkbills_per_id);
      }
    });

    console.info('选中数量 =>', checkedQuantity);
    console.info('选中数据的 id =>', selectedIds);

    checkedDataIds.value = selectedIds;

    toolbarButtons.value.forEach((item) => {
      if(item.code === 'delete') {
        item.disabled = checkedQuantity === 0;
      }
      if(item.code === 'edit') {
        item.disabled = checkedQuantity === 1 ? false: true;
      }
    })

    // _vtable_rowSeries_number
    // switch (targetIcon.name) {
    //   case 'addition':
    //     additionRow(col, row, originData, dataValue);
    //     break
    //   case 'delete':
    //     deleteRow(col, row, originData, dataValue);
    //     break
    // }
  }

  if (field === 'operation') {
    switch (targetIcon.name) {
      case 'addition':
        additionRow(col, row, originData, dataValue);
        break
      case 'delete':
        deleteRow(col, row, originData, dataValue);
        break
    }
  }
}

function onRowEditSave() {
  console.log('onDblClickCell');
  rowPopuping.value = false;
}


const value1 = ref('');
    const value2 = ref('');
    const value3 = ref('abc');
    const value4 = ref('');
    const pattern = /\d{6}/;

    // 校验函数返回 true 表示校验通过，false 表示不通过
    const validator = (val) => /1\d{10}/.test(val);

    // 校验函数可以直接返回一段错误提示
    const validatorMessage = (val) => `${val} 不合法，请重新输入`;

    // 校验函数可以返回 Promise，实现异步校验
    const asyncValidator = (val) =>
      new Promise((resolve) => {
        showLoadingToast('验证中...');

        setTimeout(() => {
          closeToast();
          resolve(val === '1234');
        }, 1000);
      });

    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo);
    };

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

    <div :class="`${prefixCls}-gird h-400 min-h-400 w-full`">

      <ListTable
        ref="list-table-el"
        :class="`${prefixCls}-gird-list-table`"
        :options="listTableOptions"
        :records="modelValue"
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
      :style="{ height: '100%',backgroundColor: '#f7f8fa' }"
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
          </van-nav-bar>
        </div>
        <div class="flex-1 min-h-100px overflow-hidden ">
          <div class="w-full h-full px-2 py-4 pb-70px overflow-y-auto">

            <div class="p-2">

              <van-form @failed="onFailed">
                <van-cell-group inset>




                   <van-field


                      label="任务内容"
                      type="textarea"
                      rows="2"
                      maxlength="50"
                      show-word-limit
                      autosize
                      placeholder="请填写 任务内容 至少 20 个字符"

                    />
                    <van-field
                      is-link
                      readonly
                      name="picker"
                      label="出发地"
                      placeholder="请选择 出发地"
                    />
                    <van-field
                      is-link
                      readonly
                      name="picker"
                      label="目的地"
                      placeholder="请选择 目的地"
                    />
                     <van-field
                      is-link
                      readonly
                      name="picker"
                      label="任务开始日期"
                      placeholder=""
                    />
                     <van-field
                      is-link
                      readonly
                      name="picker"
                      label="任务结束日期"
                      placeholder="请选择 "
                    />


                     <van-field
                      is-link
                      readonly
                      name="picker"
                      label="自备交通工具"
                      placeholder=" "
                    />

                    <van-field
                      is-link
                      readonly
                      name="picker"
                      label="自备车"
                      placeholder=" "
                    />

                    <van-field
                      is-link
                      readonly
                      name="picker"
                      label="往返公里数"
                      placeholder=" "
                    />

                     <van-field
                      is-link
                      readonly
                      name="picker"
                      label="交通工具"
                      placeholder=" "
                    />

                     <van-field

                      name="picker"
                      label="出差总结"
                      placeholder=" "
                       type="textarea"
                      rows="2"
                      maxlength="50"
                      show-word-limit
                      autosize
                    />

                     <van-field

                      name="picker"
                      label="评价意见"
                      placeholder=" "
                       type="textarea"
                      rows="2"
                      maxlength="50"
                      show-word-limit
                      autosize
                    />

                  <!--





									 -->




                  <!-- 通过 pattern 进行正则校验 -->
                   <!-- <van-field
                      name="picker"
                      label="占位内容"


                      v-for="n in 10"

                    /> -->



                </van-cell-group>

              </van-form>
            </div>







          </div>
        </div>
        <div class="">
          <van-action-bar>
          <van-action-bar-icon icon="add-o" text="增加" />
          <van-action-bar-icon icon="delete-o" text="删除" />

          <van-action-bar-icon icon="add-o" text="上一条" />
          <van-action-bar-icon icon="delete-o" text="下一条" />

          <van-action-bar-button type="danger" text="立即保存" @click="onRowEditSave" />
        </van-action-bar>
        </div>

      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped >
@prefix-cls: ~'vz-form-table';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
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

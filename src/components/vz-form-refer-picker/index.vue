<script setup lang="ts">
import { useStyle } from '@/hooks';

import { lanhiAlova } from '@/api/index'

import { Method } from 'alova';

import type { RfGetInvListParams, RfPerListParams } from '@/types/refers'

// import type { Method } from 'alova';

import { closeToast, showLoadingToast, showToast } from 'vant';

import { ref, useAttrs, useTemplateRef, watch } from 'vue';

import { useRequest } from 'alova/client';
import { cloneDeep } from 'lodash-es';

defineOptions({
  name: 'VzFormReferPicker',
})
const { referRule = '', referTitle, echoField, referCode = 'person' } = defineProps<VzFormReferPickerProps>();
const emits = defineEmits<{
  change: [
			data: any,
  ]
}>();
// ruleName
const { prefixCls } = useStyle('form-fefer-picker');

interface VzFormReferPickerProps {
  /** 参照标识代码 */
  referCode: string
  /** 参照规则 */
  referRule: string
  /** 参照标题 */
  referTitle: string
  /** 回显字段 */
  echoField: string
}

const refersMaps = ref({
  // 1 人员
  person: {
    endpoint: '/Bill/GetPerList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemPerson',
    params: {
      param: '',
      cbillname: '',
      filter: '',
      pageNum: 1,
      pageSize: 1000,
    },
  },
  // 2 质量标识
  quality: {
    endpoint: '/Bill/GetASServiceMaintenceList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemQuality',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 3 部门参照
  department: {
    endpoint: '/Bill/GetDepList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemDepartment',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 4 产品参照
  product: {
    endpoint: '/Bill/GetInvList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemProduct',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 5 费用类型
  feeType: {
    endpoint: '/Bill/GetSAFeeTypeList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemFeeType',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 6 仓库
  warehouse: {
    endpoint: '/Bill/GetWHList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemWarehouse',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 7 故障类型
  faultType: {
    endpoint: '/Bill/GetSAFaultTypeList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemFaultType',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 8 客户
  customer: {
    endpoint: '/Bill/GetCusList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemCustomer',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 9 车辆参照
  Bill_OA_OwnCarStandard: {
    endpoint: '/Bill/GetSubsidyList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemOwnCarStandard',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

  // 10 地区参照
  Bill_SA_Region: {
    endpoint: '/Bill/GetRegionList',
    method: 'POST',
    itemComponent: 'VzFormReferPickerItemRegion',
    params: {
      cbillname: '',
      param: '',
      pageSize: 10,
      pageNum: 1,
    },
  },

})

console.info('refersMaps =>', refersMaps);

const keywords = ref('');

const rfParams = ref<any>({
  param: '',
  cbillname: '',
  filter: '',
  pageNum: 1,
  pageSize: 10,

  // pageCode: '',
  // sFeild: '',

});

const rfRule = ref({
  // 参照名称
  billName: '',
  // 输入参数
  inputParams: [],
  // 输出参数
  outParams: [],

  pageNum: 1,
  pageSize: 10,
  bAccurate: false,
  // 过滤器
  filter: '',
});

function parseRfRule() {
  const rfRuleStr = referRule

  const rfRuleParagraphs = rfRuleStr.split('|')

  // console.info('rfRuleParagraphs =>', rfRuleParagraphs)
  let parsedRfRule = {
    // 参照名称
    billName: '',
    // 输入参数
    inputParams: [],
    // 输出参数
    outParams: [],
    // 过滤器
    filter: '',
  };
  parsedRfRule.billName = rfRuleParagraphs[0]
  parsedRfRule.inputParams = rfRuleParagraphs[1].split(',')
  // DO_COM_Person_ID&&DO_COM_Person_ID_ZC,cPerCode,cPerName&&cPerName_ZC
  let outParamsSplited = rfRuleParagraphs[2].split(',')
  outParamsSplited.forEach((item) => {
    let itemSplited = item.split('&&')
    if (itemSplited.length === 1) {
      itemSplited[1] = itemSplited[itemSplited.length - 1]
    }
    parsedRfRule.outParams.push(itemSplited)
  });
  // parsedRfRule.outParams = rfRuleParagraphs[2].split(',');
  // filter 解析 todo
  if (rfRuleParagraphs.length === 7) {

    // parsedRfRule.filter = rfRuleParagraphs[rfRuleParagraphs.length - 1];
  }
  rfRule.value = parsedRfRule;
  rfParams.value.cbillname = parsedRfRule.billName
}

const modelValue = defineModel<object>({
  default: {},
});

const echoFieldValue = defineModel<string>('');
const showRefer = ref(false);
const referApiMethod = ref<Method>();
const referData = ref<any>([]);

const attrs = useAttrs();

function onCloseReferPopup() {
  showRefer.value = false
}

async function onOpenReferPopup() {
  if (attrs.disabled === true) {
    return;
  }

  keywords.value = echoFieldValue.value;
  // console.info('onOpenReferPopup => keywords', keywords.value);

  rfParams.value.pageNum = 1;
  rfParams.value.param = keywords.value;
  rfParams.value.bAccurate = false;

  // referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
  //   params: rfParams,
  // });
  // const resData = await referApiMethod.value.send();
  // console.info('resData =>', resData);

  // referData.value = resData;

  showRefer.value = true
}

(async function init() {
  echoFieldValue.value = modelValue.value[echoField];
  // 解析参照规则
  parseRfRule();
})();

const listLoading = ref(false);

const listFinished = ref(false);

// const listRefreshing = ref(false);

async function onListLoad() {
  // const currentReferCode = 'person';

  // console.info('vv =>', refersMaps.value[referCode].endpoint);

  rfParams.value.param = keywords.value;

  referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
    params: rfParams,
  });
  const resData = await referApiMethod.value.send();

  referData.value = referData.value.concat(resData);

  listLoading.value = false;

  rfParams.value.pageNum = rfParams.value.pageNum + 1;

  if (resData.length < 10) {
    listFinished.value = true;
  }
  // console.info('referData.value =>', referData.value);
}

function echoFields(item: any, clear: boolean = false) {
  console.info('echoFields ....', modelValue.value);
  let getedData = {};

  // return;

  rfRule.value.outParams.forEach((param) => {
    // console.info('param =>',param);
    getedData[param[1]] = clear === true ? '' : item[param[0]];
    // 直接修改 modelValue
    modelValue.value[param[1]] = clear === true ? '' : item[param[0]];

  })

  // console.info('选择参照之后: =>',modelValue.value);

  // console.info('选择参照之后: echoFieldValue.value =>', echoFieldValue.value);
}

// onItemPicked

function onItemPicked(item: any, index: number) {
  // console.info('选择参照之前: =>',cloneDeep(modelValue.value));
  // console.info('item =>', item);
  // console.info('index =>', index);
  echoFields(item);

  console.info('onItemPicked => item', item);
  console.info('onItemPicked => modelValue.value', modelValue.value);

  echoFieldValue.value = modelValue.value[echoField];

  emits('change', item[echoField]);

  showRefer.value = false;
}

function isEchoFieldValueEmpty() {
  if (echoFieldValue.value == null)
    return true; // 处理 null 和 undefined
  if (typeof echoFieldValue.value !== 'string')
    return false; // 非字符串视为非空
  return echoFieldValue.value.trim() === '' // 去除空白字符后判断
}

async function onClickSearch() {
  console.info('onClickSearch =>', keywords.value)
  rfParams.value.pageNum = 1;
  rfParams.value.param = keywords.value;
  rfParams.value.bAccurate = false;

  referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
    params: rfParams,
  });
  const resData = await referApiMethod.value.send();

  referData.value = resData;

}

async function onSearchInput() {
  console.info('onClickSearch =>', keywords.value)
  rfParams.value.pageNum = 1;
  rfParams.value.param = keywords.value;
  rfParams.value.bAccurate = false;

  referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
    params: rfParams,
  });
  const resData = await referApiMethod.value.send();

  if (resData.length === 0) {
    showToast('没有找到相关数据!');
  }
  referData.value = resData;
}

async function onEchoFieldBlur() {
  if (!isEchoFieldValueEmpty()) {
    referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
      params: { ...rfParams.value, param: echoFieldValue.value, pageNum: 1, bAccurate: true },
    });
    const resData = await referApiMethod.value.send();

    if (resData.length === 0) {
      showToast('没有找到相关数据!');
    }
    else {
      if (resData.length === 1) {
        // 处理只有一条数据的情况
        console.info('resData.length === 1', resData);
        onItemPicked(resData[0], 0);
      }
      keywords.value = echoFieldValue.value;
    }
    referData.value = resData;
  }
}

async function onEchoFieldClear() {
  console.info('onEchoFieldClear =>', keywords.value)

}

function onEchoFieldInput() {
  console.info('onEchoFieldInput =>', keywords.value)

}

function onReferCancel() {
  showRefer.value = false;

}

function onReferConfirm() {
  showRefer.value = false;
}

watch(() => modelValue.value, (newVal) => {
  echoFieldValue.value = newVal[echoField];
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div :class="`${prefixCls} aa`">
    <van-field

      v-bind="$attrs"

      v-model="echoFieldValue"

      :class="`${prefixCls}-input`"

      right-icon="ellipsis"

      @click-right-icon="onOpenReferPopup"

      @blur="onEchoFieldBlur"
      @clear="onEchoFieldClear"
      @input="onEchoFieldInput"
    />

    <!-- position="bottom" -->
    <van-popup
      v-model:show="showRefer" :destroy-on-close="true" :close-on-click-overlay="false" title="xxx"
      :style="{ height: '80%', width: '100%' }"
      class="rd-4"
    >
      <div class="h-full w-full flex flex-col rd-4">
        <div>
          <div class="flex items-center justify-between bg-white p-4">
            <div class="flex items-center justify-center">
              <van-space size="2px">
                <van-icon name="idcard" />
                <span class="text-size-12px">参照</span>
              </van-space>
            </div>
            <div class="flex items-center justify-center text-size-14px font-bold">
              {{ referTitle }}
            </div>
            <div class="flex items-center justify-center">
              <van-icon name="cross" @click="onCloseReferPopup" />
            </div>
          </div>
          <div class="refer-searcher">
            <van-search v-model="keywords" placeholder="请输入 关键词 搜索" show-action @input="onSearchInput" @clear="onClickSearch" @search="onClickSearch">
              <template #action>
                <div @click="onClickSearch">
                  搜索
                </div>
              </template>
            </van-search>
          </div>
        </div>
        <div class="min-h-100px flex-1 overflow-hidden bg-#f4f4f4">
          <div class="h-full w-full overflow-y-auto p-8px">
            <van-list
              v-model:loading="listLoading"
              :finished="listFinished"
              finished-text="没有更多数据了"
              @load="onListLoad"
            >
              <component
                :is="refersMaps[referCode].itemComponent" v-for="(item, index) in referData" :key="`refer-item-${index}`" :item="item"

                @click="onItemPicked(item, index)"
                @tap="onItemPicked(item, index)"
              />
            </van-list>
          </div>
        </div>

        <div class="flex items-center justify-between bg-white p-4">
          <div class="flex flex-1 items-center justify-center">
            <van-button type="default" size="small" round @click="onReferCancel">
              取  消
            </van-button>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <van-button type="success" size="small" round @click="onReferConfirm">
              确  认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

<style lang="less">
.refer-searcher {
  .van-cell__value.van-field__value {
    display: block !important;
  }
}
</style>

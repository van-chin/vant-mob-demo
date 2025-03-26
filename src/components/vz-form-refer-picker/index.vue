<script setup lang="ts">
import { useStyle } from '@/hooks';

import { lanhiAlova } from '@/api/index'

import { Method } from 'alova';

import type { RfGetInvListParams, RfPerListParams } from '@/types/refers'

// import type { Method } from 'alova';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

import { useRequest } from 'alova/client';
import { cloneDeep } from 'lodash-es';

defineOptions({
  name: 'VzFormReferPicker',
})

const { referRule = '', referTitle, echoField, referCode = 'person' } = defineProps<VzFormReferPickerProps>()

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

  //

});

console.info('refersMaps =>', refersMaps);

const keywords = ref('');

const rfParams = ref<any>({
  param: '',
  cbillname: '',
  filter: '',
  pageNum: 1,
  pageSize: 10,

  pageCode: '',
  sFeild: '',

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
  bAccurate:false,
  // 过滤器
  filter: '',
});

// const { loading, error, data: rfData, send } = useRequest((params : any) => rfPerListMethod(params), {
// 		immediate: false,
// 		initialData: [],
// 	});

function parseRfRule() {
  const rfRuleStr = referRule

  console.info('referRule =>', referRule)
  console.info('rfRuleStr =>', rfRuleStr)
  // const rfRuleStr = "Bill_COM_Person|cPerCode,cPerName|DO_COM_Person_ID&&DO_COM_Person_ID_ZC,cPerCode,cPerName&&cPerName_ZC|3|False|True|isnull(dLeaveDate,'')='' and isnull(bstop,0) = 0";
  //
  const rfRuleParagraphs = rfRuleStr.split('|')

  console.info('rfRuleParagraphs =>', rfRuleParagraphs)
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

  console.info('rfRule.value =>',rfRule.value);

}

const modelValue = defineModel<object>({
  default: {},
});

const echoFieldValue = defineModel<string>('');

console.info('modelValue refer =>', modelValue.value);

const showRefer = ref(false);

const referApiMethod = ref<Method>();

const referData = ref<any>([]);

function onCloseReferPopup() {
  showRefer.value = false
}

async function onOpenReferPopup() {
  // import { Method } from 'alova';
  // /Home/GetInvList
  // /Bill/GetPerList 人员参照
  // referApiMethod.value = new Method('POST', lanhiAlova, '/Home/GetInvList', {
  //   params: rfParams,
  // });
  // referData.value = await referApiMethod.value.send();
  // console.info('referData.value =>', referData.value);
  showRefer.value = true
}

(async function init() {
  echoFieldValue.value = modelValue.value[echoField];

  console.info('referTitle =>', referTitle);
  console.info('referCode =>', referCode);

  // 解析参照规则
  parseRfRule();

  console.info('rfRule =>', rfRule.value);

})();

const listLoading = ref(false);

const listFinished = ref(false);

// const listRefreshing = ref(false);

async function onListLoad() {
  // const currentReferCode = 'person';

  console.info('vv =>', refersMaps.value[referCode].endpoint);

  referApiMethod.value = new Method(refersMaps.value[referCode].method, lanhiAlova, refersMaps.value[referCode].endpoint, {
    params: rfParams,
  });
  const resData = await referApiMethod.value.send();
  console.info('resData =>', resData);

  console.info('resData.length =>', resData.length);

  referData.value = referData.value.concat(resData);

  listLoading.value = false;

  rfParams.value.pageNum = rfParams.value.pageNum + 1;

  if (resData.length < 10) {
    listFinished.value = true;
  }
  console.info('referData.value =>', referData.value);

}




function echoFields(item:any,clear : boolean = false) {
    console.info('echoFields ....');
		let getedData = {};

		rfRule.value.outParams.forEach((param) => {
			// console.info('param =>',param);
			getedData[param[1]] = clear === true ? '' : item[param[0]];
			// 直接修改 modelValue
			modelValue.value[param[1]] = clear === true ? '' : item[param[0]];

		});


    // console.info('选择参照之后: =>',modelValue.value);
}

// onItemPicked

function onItemPicked(item: any, index: number) {
  // console.info('选择参照之前: =>',cloneDeep(modelValue.value));
  echoFields(item);

  echoFieldValue.value = modelValue.value[echoField];

  showRefer.value = false;
}

function onClickSearch() {
  console.info('onClickSearch =>', keywords.value)

}

function onEchoFieldBlur() {
  console.info('onEchoFieldBlur =>', echoFieldValue.value)

}

function onEchoFieldClear() {
  console.info('onEchoFieldClear =>', echoFieldValue.value)
}

function onEchoFieldInput() {
  console.info('onEchoFieldInput =>', echoFieldValue.value)

}
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
            <van-search v-model="keywords" placeholder="请输入 关键词 搜索" show-action>
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




              <component :is="refersMaps[referCode].itemComponent" v-for="(item, index) in referData" :key="`refer-item-${index}`" :item="item"

              @click="onItemPicked(item,index)"
              @tap="onItemPicked(item,index)"
              />
            </van-list>

            <!-- <template v-if="referData.length">
              <van-card

                v-for="(item, index) in referData"
                :key="`refer-item-${index}`"
                num="2"
                price="2.00"
                desc="描述信息"
                :title="item.cjobname"
                thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
              />
            </template>
            <template v-else>
              <van-empty description="描述文字" />
            </template> -->
          </div>
        </div>

        <div class="flex items-center justify-between bg-white p-4">
          <div class="flex flex-1 items-center justify-center">
            <van-button type="default" size="small" round>
              取  消
            </van-button>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <van-button type="success" size="small" round>
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

<script setup lang="ts">
import { useStyle } from '@/hooks';

import { getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

// @prefix-cls: ~'vz-form-refer-picker-item-person';
defineOptions({
  name: 'VzFormReferPickerItemPerson',
})

defineProps<VzFormReferPickerItemPersonProps>()

const { prefixCls } = useStyle('form-refer-picker-item-person');

interface VzFormReferPickerItemPersonProps {
  /** 数据项目 */
  item: object
}

// const modelValue = defineModel<string | number | boolean>({
//   default: '',
// });

(async function init() {

})();

</script>

<template>
  <div class="mb-8px w-full rd-4 bg-white p-4 text-12px text-#00000073">
    <!-- 客户名称：河南矿山
    产品编码：11500
    产品名称：拱架台车
    质量标识码：1003
    业务来源单号：2412160001

    {
    "DO_SA_Customer_ID": "314C87D3-D07E-4C19-A507-CB0E597D8861",
    "cCusCode": "K0001",
    "cCusName": "河南矿山",
    "cBusType": "XS",
    "cSource": "bill_sa_issbill",
    "cExecuteCode": "2412160001",
    "DO_COM_Inventory_ID": "81809AA3-3E12-4DF5-A3EE-AB202E2FB4B3",
    "cInvCode": "11500",
    "cInvName": "拱架台车",
    "cInvSpec": "10*10",
    "fQuantity": "1.00000000",
    "cQualityCode": "1003",
    "DO_COM_Person_ID_Box": "",
    "cPerCode_Box": "",
    "cPerName_Box": "",
    "dBoxdate": "",
    "cDeliManager": "测试",
    "cPosition": "",
    "cTelephone": "1365444444",
    "cPerName_Equ": "",
    "cTelephone_Equ": "",
    "cReceiveAddress": "河南郑州",
    "dThreePackDate": "",
    "DO_COM_Person_ID_JF": "",
    "cPerCode_JF": "",
    "cPerName_JF": "",
    "dOverDate": "",
    "dStartUseDate": "2024-12-18T23:59:00+08:00",
    "dFirstGuaranteeDate": "",
    "dLastGuaranteeDate": "",
    "cProArea": "SCLH"
}

    -->

    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        客户名称：
      </div>
      <div>{{ item.ccusname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        产品编码：
      </div>
      <div>{{ item.cinvcode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        产品名称：
      </div>
      <div>{{ item.cinvname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        质量标识码：
      </div>
      <div>{{ item.cqualitycode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        业务来源单号：
      </div>
      <div>{{ item.cexecutecode }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker-item-quality';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

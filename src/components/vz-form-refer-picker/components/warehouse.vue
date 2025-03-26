<script setup lang="ts">
import { useStyle } from '@/hooks';

import { getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

// @prefix-cls: ~'vz-form-refer-picker-item-person';
defineOptions({
  name: 'VzFormReferPickerItemWarehouse',
})

defineProps<VzFormReferPickerItemWarehouseProps>()

const { prefixCls } = useStyle('form-refer-picker-item-warehouse');

interface VzFormReferPickerItemWarehouseProps {
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


    <!-- {
            "do_com_warehouse_id": "3A16BC5F-2479-9E0C-6E77-102813C4E8E9",
            "cwhcode": "01",
            "cwhname": "成品库",
            "cwhprop": "PT",
            "cdepame": "仓储部",
            "bmrp": "true",
            "bwl": "false",
            "couttype": "ALL",
            "bstop": "false",
            "do_com_depart_id": "3A16BB89-37D0-A057-BA08-2B7DE7A3AADE",
            "cdepcode": "SCLH05",
            "do_com_person_id": "3A16BB91-7CB1-3FBC-2A7E-3836E9035C38",
            "cpercode": "10003",
            "cpername": "小六"
        }, -->

    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        仓库名称：
      </div>
      <div>{{ item.cwhname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        仓库编码：
      </div>
      <div>{{ item.cwhcode }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker-item-warehouse';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

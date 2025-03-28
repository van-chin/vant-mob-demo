<script setup lang="ts">
import { useStyle } from '@/hooks';

import { getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

import { formatNumberThousand } from '@utopia-utils/core';

// @prefix-cls: ~'vz-form-refer-picker-item-person';
defineOptions({
  name: 'VzFormReferPickerItemOwnCarStandard',
})

defineProps<VzFormReferPickerItemOwnCarStandardProps>()

const { prefixCls } = useStyle('form-refer-picker-item-own-car-standard');

interface VzFormReferPickerItemOwnCarStandardProps {
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
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        补贴标准名称：
      </div>
      <div>{{ item.csubsidyname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        补贴标准编码：
      </div>
      <div>{{ item.csubsidycode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        补贴标准：
      </div>
      <div>{{ parseFloat(item.fstandard).toFixed(2) }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker-item-own-car-standard';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

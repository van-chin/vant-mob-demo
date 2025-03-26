<script setup lang="ts">
import { useStyle } from '@/hooks';

import { getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

// @prefix-cls: ~'vz-form-refer-picker-item-person';
defineOptions({
  name: 'VzFormReferPickerItemProduct',
})

defineProps<VzFormReferPickerItemProductProps>()

const { prefixCls } = useStyle('form-refer-picker-item-product');

interface VzFormReferPickerItemProductProps {
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
        产品名称：
      </div>
      <div>{{ item.cinvname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        产品编码：
      </div>
      <div>{{ item.cinvcode }}</div>
    </div>

     <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        型号规格：
      </div>
      <div>{{ item.cinvspec }}</div>
    </div>

     <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        材质：
      </div>
      <div>{{ item.cmaterial }}</div>
    </div>

     <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        计量单位：
      </div>
      <div>{{ item.cmuname }}</div>
    </div>




  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker-item-product';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

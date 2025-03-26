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
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        人员名称：
      </div>
      <div>{{ item.cpername }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        人员编码：
      </div>
      <div>{{ item.cpercode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        部门名称：
      </div>
      <div>{{ item.cdepname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        部门编码：
      </div>
      <div>{{ item.cdepcode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        岗位名称：
      </div>
      <div>{{ item.cjobname }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        岗位编码：
      </div>
      <div>{{ item.cjobcode }}</div>
    </div>
    <div class="flex items-center justify-between p-2">
      <div class="font-bold">
        上级主管：
      </div>
      <div>{{ item.cpername_h }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker-item-person';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

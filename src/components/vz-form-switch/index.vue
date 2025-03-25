<script setup lang="ts">
import { useStyle } from '@/hooks';

import { getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormSwitch',
})

defineProps<VzFormSwitchProps>()

const { prefixCls } = useStyle('form-switch');

interface VzFormSwitchProps {
  /** 枚举规则名称 */
  // ruleName: string

}

// switch

const modelValue = defineModel<string | number | boolean>({
  default: '',
});

console.info('modelValue =>', modelValue.value);

(async function init() {

})();

</script>

<template>
  <van-field
    v-bind="$attrs"
    :class="`${prefixCls}`"
    readonly
  >
    <template #input>
      <van-switch v-bind="$attrs" v-model="modelValue" />
    </template>
  </van-field>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-switch';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

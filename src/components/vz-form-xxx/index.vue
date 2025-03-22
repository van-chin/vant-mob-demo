<script setup lang="ts">
import { useStyle } from '@/hooks';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormDatePicker',
})

const { columns } = defineProps<VzFormDatePickerProps>()

const { prefixCls } = useStyle('form-date-picker');

interface VzFormDatePickerProps {
  columns: Record<string, any>[]
}

const modelValue = defineModel<any[]>('value', {
  default: '',
});

(async function init() {
  console.info('init =>');
})();

</script>

<template>
  <div :class="`${prefixCls}`">
    {{ modelValue }}
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-date-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  border: 2px solid red;
}
</style>

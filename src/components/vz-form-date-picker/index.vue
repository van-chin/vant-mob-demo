<script setup lang="ts">
import { useStyle } from '@/hooks';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormDatePicker',
})

const { abc } = defineProps<VzFormDatePickerProps>()

const { prefixCls } = useStyle('form-date-picker');

interface VzFormDatePickerProps {
  abc?: string
}

const modelValue = defineModel<string>('value', {
  default: '',
});

const showPicker = ref(false);
const pickerValue = ref([]);
function onConfirm({ selectedValues }) {
  modelValue.value = selectedValues.join('-');
  pickerValue.value = selectedValues
  showPicker.value = false
  console.info('modelValue.value =>', modelValue.value);
}

(async function init() {
  console.info('init =>', modelValue.value);
  if (modelValue.value.includes('-')) {
    pickerValue.value = modelValue.value.split('-');
  }
  else {
    pickerValue.value = [];
  }
})();

</script>

<template>
  <van-field

    v-bind="$attrs"
    v-model="modelValue"
    :class="`${prefixCls}`"
    is-link

    readonly

    name="datePicker"

    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" destroy-on-close position="bottom" title="xxx">
    <van-date-picker
      :model-value="pickerValue"
      :title="$attrs.label"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-date-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

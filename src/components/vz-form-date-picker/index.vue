<script setup lang="ts">
import { useStyle } from '@/hooks';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormDatePicker',
})

const { abc } = defineProps<VzFormDatePickerProps>()

const emits = defineEmits<{
  change: [
			data: any,
  ]
}>()

const { prefixCls } = useStyle('form-date-picker')

interface VzFormDatePickerProps {
  abc?: string
}

const modelValue = defineModel<string>({
  default: '',
});

const showPicker = ref(false);
const pickerValue = ref([]);
function onConfirm({ selectedValues }) {
  modelValue.value = selectedValues.join('-') + ' 00:00:00';
  pickerValue.value = selectedValues
  showPicker.value = false
  console.info('modelValue.value =>', modelValue.value);
  emits('change', modelValue.value);
}

const minDate = new Date(2025, 2, 15);


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
  <div class="h-full w-full">
    <van-field

      v-bind="$attrs"
      v-model="modelValue"
      :class="`${prefixCls}`"
      is-link

      readonly

      @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom" title="xxx">
      <van-date-picker
        :model-value="pickerValue"
        :title="$attrs.label"
        :minDate="minDate"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-date-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

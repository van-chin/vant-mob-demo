<script setup lang="ts">
import { useStyle } from '@/hooks';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useAttrs, useTemplateRef, watch } from 'vue';

import dayjs from 'dayjs';

defineOptions({
  name: 'VzFormDateTimePicker',
})

const { abc } = defineProps<VzFormDateTimePickerProps>()

const emits = defineEmits<{
  change: [
			data: any,
  ]
}>()

const { prefixCls } = useStyle('form-date-picker-time')

interface VzFormDateTimePickerProps {
  abc?: string
}

const modelValue = defineModel<string>({
  default: '',
});

const today = dayjs().format('YYYY-MM-DD');
console.info('today =>', today);

const showPicker = ref(false);
const pickerValue = ref([]);

const attrs = useAttrs();

pickerValue.value = today.split('-');

const timePickerColumnsType = ['hour', 'minute', 'second'];
const pickerTimeValue = ref(['00', '00', '00']);

function onConfirm() {
  // modelValue.value = `${selectedValues.join('-')} ${pickerTimeValue.value.join(':')}`
  modelValue.value = `${pickerValue.value.join('-')} ${pickerTimeValue.value.join(':')}`

  showPicker.value = false
  console.info('modelValue.value xxx =>', modelValue.value);
  emits('change', modelValue.value);
}

const minDate = dayjs().subtract(1,'year').toDate();

console.info('minDate =>', minDate);
// console.info('minDate dayjs =>', dayjs());

(async function init() {
  console.info('init =>', modelValue.value);
  if (modelValue.value.includes('-')) {
    pickerValue.value = modelValue.value.split('-');
  }
  else {
    pickerValue.value = [];
  }
})();

function onShowPicker() {
  if (attrs.disabled === true) {
    return
  }
  showPicker.value = true
}
</script>

<template>
  <div class="h-full w-full">
    <van-field

      v-bind="$attrs"
      v-model="modelValue"
      :class="`${prefixCls}`"
      is-link

      readonly

      @click="onShowPicker"
    />
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom" title="xxx">
      <van-picker-group
        v-model="pickerValue"
        :title="$attrs.label"
        :tabs="['选择日期', '选择时间']"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      >
        <van-date-picker
          v-model="pickerValue"
          :min-date="minDate"
        />
        <van-time-picker v-model="pickerTimeValue" :columns-type="timePickerColumnsType" />
      </van-picker-group>

      <!-- <van-date-picker-time
        :model-value="pickerValue"
        :title="$attrs.label"
        :min-date="minDate"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      /> -->
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-date-picker-time';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

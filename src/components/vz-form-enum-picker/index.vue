<script setup lang="ts">
import { useStyle } from '@/hooks';

import {getEnumsByRuleName } from '@/composables/sys-enums';

import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormEnumPicker',
})

const { ruleName } = defineProps<VzFormEnumPickerProps>()

// ruleName
const { prefixCls } = useStyle('form-enum-picker');

interface VzFormEnumPickerProps {
  /** 枚举规则名称 */
  ruleName: string

}

const modelValue = defineModel<string>({
  default: '',
});


console.info('modelValue =>', modelValue.value);

const enumColumns = ref([]);


const pickedText = ref('');

// const fieldNames = ref({ text: 'text', value: 'value', children: 'children' });

const showPicker = ref(false);
const pickerValue = ref([]);
function onConfirm({ selectedValues, selectedOptions, selectedIndexes }) {

  pickedText.value = selectedOptions[0].text;
  modelValue.value = selectedValues[0];

  pickerValue.value = selectedValues

  showPicker.value = false

}

(async function init() {



  enumColumns.value = getEnumsByRuleName(ruleName);


  if(modelValue.value) {

    const enumItem = enumColumns.value.find(item => item.value === modelValue.value);
    pickedText.value = enumItem.text;



    pickerValue.value = [modelValue.value];
  }

})();

// watch(()=> modelValue.value, (newValue, oldValue) => {
//   console.info('watch modelValue.value =>', newValue);
// },{
//   immediate: true,
// })

</script>

<template>
  <van-field

    v-bind="$attrs"
    v-model="pickedText"
    :class="`${prefixCls}`"
    is-link

    readonly



    @click="showPicker = true"
  />


  <van-popup v-model:show="showPicker" destroy-on-close position="bottom" title="xxx">
    <van-picker
    v-bind="$attrs"
    :title="$attrs.label"
    :model-value="pickerValue"
    :columns="enumColumns"
    @cancel="showPicker = false"
    @confirm="onConfirm"
  />
  </van-popup>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-enum-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  // border: 2px solid red;
}
</style>

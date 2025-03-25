<script setup lang="ts">
import { useStyle } from '@/hooks';



import { closeToast, showLoadingToast } from 'vant';

import { ref, useTemplateRef, watch } from 'vue';

defineOptions({
  name: 'VzFormReferPicker',
})

const { referRule = "",referTitle,echoField } = defineProps<VzFormReferPickerProps>()

// ruleName
const { prefixCls } = useStyle('form-fefer-picker');

interface VzFormReferPickerProps {
  /** 参照规则 */
  referRule: string
  /** 参照标题 */
  referTitle: string
  /** 回显字段 */
  echoField:string
}



const keywords = ref('');

const rfParams = ref<any>({
		param: '',
		cbillname: '',
		filter: '',
		pageNum: 1,
		pageSize: 1000,
	});

const rfRule = ref({
		// 参照名称
		billName: '',
		// 输入参数
		inputParams: [],
		// 输出参数
		outParams: [],
		// 过滤器
		filter: '',
	});


  const parseRfRule = () => {
		const rfRuleStr = referRule;

    console.info('referRule =>', referRule);
    console.info('rfRuleStr =>', rfRuleStr);
		// const rfRuleStr = "Bill_COM_Person|cPerCode,cPerName|DO_COM_Person_ID&&DO_COM_Person_ID_ZC,cPerCode,cPerName&&cPerName_ZC|3|False|True|isnull(dLeaveDate,'')='' and isnull(bstop,0) = 0";
		//
		const rfRuleParagraphs = rfRuleStr.split('|');

		console.info('rfRuleParagraphs =>', rfRuleParagraphs);
		let parsedRfRule = {
			// 参照名称
			billName: '',
			// 输入参数
			inputParams: [],
			// 输出参数
			outParams: [],
			// 过滤器
			filter: '',
		};
		parsedRfRule.billName = rfRuleParagraphs[0];
		parsedRfRule.inputParams = rfRuleParagraphs[1].split(',');
		// DO_COM_Person_ID&&DO_COM_Person_ID_ZC,cPerCode,cPerName&&cPerName_ZC
		let outParamsSplited = rfRuleParagraphs[2].split(',');
		outParamsSplited.forEach((item) => {
			let itemSplited = item.split('&&');
			if (itemSplited.length === 1) {
				itemSplited[1] = itemSplited[itemSplited.length - 1];
			}
			parsedRfRule.outParams.push(itemSplited);
		});
		// parsedRfRule.outParams = rfRuleParagraphs[2].split(',');
		// filter 解析 todo
		if (rfRuleParagraphs.length === 7) {

			// parsedRfRule.filter = rfRuleParagraphs[rfRuleParagraphs.length - 1];
		}



		rfRule.value = parsedRfRule;

		rfParams.value.cbillname = parsedRfRule.billName;

		// return parsedRfRule;


		// const [billName,inputParams,outParams, c] = [10, 20, 30];
		// "Bill_COM_Person|cPerCode,cPerName|DO_COM_Person_ID,cPerCode,cPerName,DO_COM_Depart_ID,cDepCode,cDepName|3|False|True|isnull(dLeaveDate,'')='' and isnull(bstop,0) = 0";
		/*
		0: "Bill_COM_Person" // 参照名称 billName
		1: "cPerCode,cPerName" // 返回字段 inputParams
		2: "DO_COM_Person_ID,cPerCode,cPerName,DO_COM_Depart_ID,cDepCode,cDepName" // &&  outParams
		3: "3" //
		4: "False" //
		5: "True" //
		6: "isnull(dLeaveDate,'')='' and isnull(bstop,0) = 0" // 过滤器 filter
		*/
		//
	}

const modelValue = defineModel<Object>({
  default: {},
});


const echoFieldValue = defineModel<string>('');

console.info('modelValue refer =>', modelValue.value);

const showRefer = ref(false);

const onCloseReferPopup = () => {
  showRefer.value = false;
}


const onOpenReferPopup = () => {
  showRefer.value = true;
}

(async function init() {


  echoFieldValue.value = modelValue.value[echoField];

  console.info('referTitle =>', referTitle);

  // 解析参照规则
		parseRfRule();

    console.info('rfRule =>', rfRule.value);



})();


const onClickSearch = () => {
  console.info('onClickSearch =>', keywords.value);

}

const onEchoFieldBlur = () => {
  console.info('onEchoFieldBlur =>', echoFieldValue.value);

}

const onEchoFieldClear = () => {
console.info('onEchoFieldClear =>', echoFieldValue.value);
}

const onEchoFieldInput = () => {
  console.info('onEchoFieldInput =>', echoFieldValue.value);

}




</script>

<template>
  <div :class="`${prefixCls} aa`">
    <van-field

    v-bind="$attrs"

    :class="`${prefixCls}-input`"

    v-model="echoFieldValue"

    right-icon="ellipsis"


    @click-right-icon="onOpenReferPopup"

    @blur="onEchoFieldBlur"
    @clear="onEchoFieldClear"
		@input="onEchoFieldInput"




  />

<!-- position="bottom" -->
  <van-popup v-model:show="showRefer" :destroy-on-close="true" :close-on-click-overlay="false" title="xxx"
    :style="{ height: '80%', width: '100%' }"
    class="rd-4"
  >
    <div class="w-full h-full flex flex-col rd-4">
      <div>
        <div class=" flex justify-between items-center p-4 bg-white">
        <div class="flex justify-center items-center ">
          <van-space size="2px">
          <van-icon name="idcard" />
          <span class="text-size-12px">参照</span>
         </van-space>
        </div>
        <div class="flex justify-center items-center text-size-14px font-bold">{{ referTitle }}</div>
        <div class="flex justify-center items-center "><van-icon name="cross" @click="onCloseReferPopup" /></div>
      </div>
      <div class="">
          <van-search v-model="keywords" placeholder="请输入 关键词 搜索" >
            <template #action>
              <div @click="onClickSearch">搜索</div>
            </template>
            </van-search>
      </div>
      </div>
      <div class="flex-1 min-h-100px overflow-hidden">
       <div class="overflow-y-auto h-full w-full  p-4">
         <van-card
          num="2"
          price="2.00"
          v-for="n in 10"
          desc="描述信息"
          title="商品标题"
          thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-empty description="描述文字" />
       </div>

      </div>


      <div class="flex justify-between items-center p-4 bg-white">
        <div class="flex justify-center items-center flex-1">
          <van-button type="default" size="mini">取  消</van-button>
        </div>
        <div class="flex justify-center items-center flex-1">
          <van-button type="success" size="mini">确  认</van-button>
        </div>
      </div>



    </div>
  </van-popup>


  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-refer-picker';

.@{prefix-cls} {
  width: 100%;
  height: 100%;
  border: 2px solid red;
}
</style>

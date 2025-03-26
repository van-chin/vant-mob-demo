<script setup lang="ts">
import { StorageSerializers, useStorage, useStorageAsync } from '@vueuse/core'
import type { VzFormSchema } from '@/types/form-designer'

import { closeToast, showLoadingToast,showSuccessToast,showToast } from 'vant';

import {headCellCheckMethod} from '@/api/methods/bills';



import data from './data/BO_HR_OutWorkBill.json'

import {
  getEnumsByAcc,
} from '@/api/methods/enums';

import {
  useNewBill,
} from '@/composables/bills';

const route = useRoute();

const list = ref<VzFormSchema>(data)

console.info('route =>', route);

const { query } = route;

const { token, jwtkey, caccid, billName } = query;


const initNewBilled = ref(false);

const tokenJwtkeyAcc = useStorage('TOKEN-JWTKEY-ACC', { token: '', jwtkey: '', caccid: '', billName: '' });
tokenJwtkeyAcc.value = { token, jwtkey, caccid, billName };

const sysEnums = useStorage('SYS-ENUMS', [], undefined, {
  serializer: StorageSerializers.object,
});

// 获取 getEnums

async function getEnums(acc: string) {
  const enums = await getEnumsByAcc(acc);
  sysEnums.value = JSON.parse(enums);
}

(async function init() {
  await getEnums(tokenJwtkeyAcc.value.caccid);
  const newBillRes = await useNewBill();
  console.info('init newBillRes =>', newBillRes);


  list.value.model = newBillRes.model;

  console.info('list.value =>', list.value);


  initNewBilled.value = true;
})();



/**
	 * 表头检查
	 * @field field 当前数据发生变化的字段
	 * @field value 当前数据发生变化的 值
	 */
	const handleHeadCellCheck = async (field : string, value : string) => {

    showLoadingToast('');
		const {cBIName,caccid}  =  useBiNameAndCaccid();
		let headCellCheckParams  = {
			id: '',
			cBIName,
			caccid,
			itemName: field,
			val: value,
			items: JSON.stringify({ model: list.value.model })
		};
		const res = await headCellCheckMethod(headCellCheckParams);
    console.info('handleHeadCellCheck => res',res);
		// const headCellCheckResValue = res.ClientData[0].Value;
		// advanceFormSchema.value.model = headCellCheckResValue;
	}

const onFieldEmited = (field:string,data:any) => {
  console.info('onFieldEmited => field',field);
  console.info('onFieldEmited => data',data);
  console.info('list.value.model',list.value.model);
  switch (field) {
    case 'bathome': //  国内
      list.value.model['batabroad'] = data === '1' ? '0' : '1';
      break;
    case 'batabroad': // 国外
      list.value.model['bathome'] = data === '1' ? '0' : '1';
      break;
  }

  handleHeadCellCheck(field,data);
};

const onFieldBlur = (field:string,event:any) => {
  // console.info('onFieldEmited => field',field);
  // console.info('onFieldEmited => data',data);
  console.info('list.value.model',list.value.model);
  switch (field) {
    case 'bgsgp': //  公司购票
      console.info('bgsgp => event ',list.value.model.bgsgp);
      handleHeadCellCheck('bgsgp',list.value.model.bgsgp);
      break;
  }
};

//

</script>
<!-- batabroad-change -->
<template>
  <div>
    <FormRenderer
      :data="list"
      v-if="initNewBilled"
      @bathome-change="({value}) => onFieldEmited('bathome', value)"
      @batabroad-change="({value}) => onFieldEmited('batabroad', value)"
      @bgsgp-blur="({event}) => onFieldBlur('bgsgp', event)"
    </FormRenderer>
  </div>
</template>

<route lang="json5">
{
  name: 'forms',
  meta: {
    title: '表单渲染',
    i18n: 'menus.formRender'
  },
}
</route>

<script setup lang="ts">
import { StorageSerializers, useStorage, useStorageAsync } from '@vueuse/core'
import type { VzFormSchema } from '@/types/form-designer'

import { closeToast, showLoadingToast, showSuccessToast, showToast } from 'vant';

import { isObject } from 'lodash-es'

import { bodyCellCheckMethod, headCellCheckMethod,loadBillMethod } from '@/api/methods/bills';

import type { BodyCellCheckParams,HeadCellCheckParams,LoadBillParams } from '@/types/bills'
import { foreach } from 'tree-lodash'
import data from './data/BO_HR_OutWorkBill.json'


import { keyBy } from "lodash-es";

import {
  getEnumsByAcc,
} from '@/api/methods/enums';

import {
  useNewBill,
  useLoadBill,
  useModifyBill
} from '@/composables/bills';

const route = useRoute();
const list = ref<VzFormSchema>(data)
const { query } = route;
const { token, jwtkey, caccid, billName,billId } = query;
const initBilled = ref(false);
// console.info('billId =>',billId);
const renderMode = ref('edit');
const tokenJwtkeyAcc = useStorage('TOKEN-JWTKEY-ACC', { token: '', jwtkey: '', caccid: '', billName: '' });
tokenJwtkeyAcc.value = { token, jwtkey, caccid, billName };
const sysEnums = useStorage('SYS-ENUMS', [], undefined, {
  serializer: StorageSerializers.object,
});
async function getEnums(acc: string) {
  const enums = await getEnumsByAcc(acc);
  sysEnums.value = JSON.parse(enums);
}


const parseEditItems = (editItems) => {
let editHeadItems = [];
    let editBodyItems = [];


    editItems.forEach(editItem => {
      editItem.sEditResult.forEach(eItem => {

        const lowerCasedItem = eItem.map(item => item.toLowerCase());


        // allItems.push(lowerCasedItem);
        if(lowerCasedItem[0] === 'h') {
          editHeadItems.push(lowerCasedItem[1]);
        } else {
          editBodyItems.push(lowerCasedItem);
        }


      });
    });


    let keyByed = keyBy(editBodyItems,(item)=>item[2]);

    let bos = {};
    Object.keys(keyByed).forEach((key)=>{
      bos[key] = [];
    })
    console.info('bos =>',bos);

    Object.keys(bos).forEach((key)=>{
      editBodyItems.forEach((item)=>{
        if(item[2] === key) {
          bos[key].push(item[1]);
        }
      });
    });

    bos['head'] = editHeadItems;
    console.info('bos =>',bos);

    return bos;
}

(async function init() {
  console.info('init billId =>',billId);
  await getEnums(tokenJwtkeyAcc.value.caccid);
  // ModifyBill(string cBIName, string caccid, string id)

  if(billId === undefined) {
    console.info('没有数据，需要新建立单子');
    const newBillRes = await useNewBill();
    console.info('newBillRes =>',newBillRes);
    const {model,editItems} = newBillRes;
    console.info('editItems =>',editItems);

    const bos = parseEditItems(editItems);


    foreach(list.value.items[0].children, (item) => {
          if (item.component.vant) {
            if(list.value.modelKeys[item.id]) {
              if(!bos.head.includes(list.value.modelKeys[item.id].model)) {
                item.component.vant.props.disabled = true;
              }
            }
            if(item.component.vant.name === 'VzFormTable') {
              item.component.vant.props.columns.forEach((col,idx) => {
                // console.info('col =>',col.title,col.key,'禁用',!bos[list.value.modelKeys[item.id].model].includes(col.key));
                  if(!bos[list.value.modelKeys[item.id].model].includes(col.key)) {
                    col.component.vant.props.disabled = true;
                  }
              });
            }
          }
    });

    list.value.model = model;
  } else {
      console.info('有单据ID，需要load单子');

      const modifyBillRes = await useModifyBill(billId as string);

      console.info('modifyBillRes =>',modifyBillRes);

      const {editItems} = modifyBillRes;
      console.info('editItems =>',editItems);

      const bos = parseEditItems(editItems);
      console.info('bos ===>',bos);

			const loadBillRes = await useLoadBill(billId as string);

      foreach(list.value.items[0].children, (item) => {
          if (item.component.vant) {
            if(list.value.modelKeys[item.id]) {
              if(!bos.head.includes(list.value.modelKeys[item.id].model)) {
                item.component.vant.props.disabled = true;
              }
            }
            if(item.component.vant.name === 'VzFormTable') {
              item.component.vant.props.columns.forEach((col,idx) => {
                // console.info('col =>',col.title,col.key,'禁用',!bos[list.value.modelKeys[item.id].model].includes(col.key));
                  if(!bos[list.value.modelKeys[item.id].model].includes(col.key)) {
                    col.component.vant.props.disabled = true;
                  }
              });
            }
          }
    });



      list.value.model = loadBillRes.model;
  }
  initBilled.value = true;
})();

/**
 * 表头检查
 * @field field 当前数据发生变化的字段
 * @field value 当前数据发生变化的 值
 */
async function handleHeadCellCheck(field: string, value: string) {
  showLoadingToast('')
  const { cBIName, caccid } = useBiNameAndCaccid()
  const headCellCheckParams:HeadCellCheckParams = {
    id: list.value.model[list.value.items[0].item.vant.primaryKey] as string,
    cBIName,
    caccid,
    itemName: field,
    val: value,
    items: JSON.stringify({ model: list.value.model }),
  }
  const cellCheckRes = await headCellCheckMethod(headCellCheckParams)
  console.info('headCellCheckRes =>',cellCheckRes);
  const { ClientData } = cellCheckRes;
  if(ClientData) {
    if (ClientData.length && ClientData[0].Value && isObject(ClientData[0].Value)) {
      list.value.model = ClientData[0].Value;
    }
  }

  closeToast();
}

/**
 * 表体检查
 * @field field 当前数据发生变化的字段
 * @field value 当前数据发生变化的 值
 */
async function handleBodyCellCheck(field: string, value: string) {
  showLoadingToast('')
  const { cBIName, caccid } = useBiNameAndCaccid()
  const bodyCellCheckParams: BodyCellCheckParams = {
    id: list.value.model[list.value.items[0].item.vant.primaryKey] as string,
    cBIName,
    caccid,
    boName: field,
    itemName: value.field,
    val: value.fieldValue,
    items: JSON.stringify({ model: list.value.model }),
    indexrow: value.rowIndex,
  }
  const cellCheckRes = await bodyCellCheckMethod(bodyCellCheckParams);
  console.info('bodyCellCheckRes =>', cellCheckRes);
  const { ClientData } = cellCheckRes;
  if(ClientData) {
    if (ClientData.length && ClientData[0].Value && isObject(ClientData[0].Value)) {
      list.value.model = ClientData[0].Value;
    }
  }

  closeToast();
}

function onFieldEmited(field: string, data: any) {
  console.info('field =>', field);
  console.info('data =>', data);
  switch (field) {
    case 'bathome': //  国内
      list.value.model.batabroad = data === '1' ? '0' : '1'
      break;
    case 'batabroad': // 国外
      list.value.model.bathome = data === '1' ? '0' : '1'
      break;
  }
  handleHeadCellCheck(field, data)
}

function onBoFieldEmited(field: string, data: any) {
  handleBodyCellCheck(field, data);
}


const onToolBarAction = (action:string) =>{
 switch (action) {
    case 'saved':
      console.info('saved => ....');
      break;
    case 'commited':
      console.info('commited => ....');
      break;
  }
}
</script>
<template>
  <div>
    <vz-form-renderer

      v-if="initBilled"
      :data="list"
      :renderMode="renderMode"
      @bathome-change="({ value }) => onFieldEmited('bathome', value)"
      @batabroad-change="({ value }) => onFieldEmited('batabroad', value)"
      @bgsgp-change="({ value }) => onFieldEmited('bgsgp', value)"
      @coutcooutry-change="({ value }) => onFieldEmited('coutcooutry', value)"
      @dplanstartdate-change="({ value }) => onFieldEmited('dplanstartdate', value)"
      @dplanenddate-change="({ value }) => onFieldEmited('dplanenddate', value)"
      @drealstartdate-change="({ value }) => onFieldEmited('drealstartdate', value)"
      @drealenddate-change="({ value }) => onFieldEmited('drealenddate', value)"
      @cpername-change="({ value }) => onFieldEmited('cpername', value)"

      @bo_hr_outworkbills_per-change="({ value }) => onBoFieldEmited('bo_hr_outworkbills_per', value)"
      @bo_hr_outworkbills_work-change="({ value }) => onBoFieldEmited('bo_hr_outworkbills_work', value)"

      @saved="onToolBarAction('saved')"
      @commited="onToolBarAction('commited')"
    />
  </div>
</template>

<route lang="json5">
{
  name: 'forms',
  meta: {
    title: '出差任务单',
    i18n: 'bills.businessTrip'
  },
}
</route>

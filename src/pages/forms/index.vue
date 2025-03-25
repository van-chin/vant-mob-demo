<script setup lang="ts">
import { StorageSerializers, useStorage, useStorageAsync } from '@vueuse/core'
import type { VzFormSchema } from '@/types/form-designer'

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

</script>

<template>
  <div>
    <FormRenderer :data="list" v-if="initNewBilled" />
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

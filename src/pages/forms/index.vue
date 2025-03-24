<script setup lang="ts">
import { StorageSerializers, useStorage, useStorageAsync } from '@vueuse/core'
import type { VzFormSchema } from '@/types/form-designer'

import data from './data/BO_HR_OutWorkBill.json'

import {
  getEnumsByAcc,
} from '@/api/user';

const route = useRoute();

const list = ref<VzFormSchema>(data)

console.info('route =>', route);

const { query } = route;

const { token, jwtkey, caccid } = query;

const tokenJwtkeyAcc = useStorage('TOKEN-JWTKEY-ACC', { token: '', jwtkey: '', caccid: '' });
tokenJwtkeyAcc.value = { token, jwtkey, caccid };

const sysEnums = useStorage('SYS-ENUMS', [], undefined, {
  serializer: StorageSerializers.object,
});

// 获取 getEnums

async function getEnums(acc: string) {
  const { data } = await getEnumsByAcc(acc);
  sysEnums.value = JSON.parse(data);
}

getEnums(tokenJwtkeyAcc.value.caccid);

</script>

<template>
  <div>
    <FormRenderer :data="list" />
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

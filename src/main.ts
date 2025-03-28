import { createApp } from "vue";
import { createHead } from "@unhead/vue";
import App from "@/App.vue";
import router from "@/router";
import pinia from "@/stores";
import "virtual:uno.css";
import "@/styles/app.less";
import "@/styles/var.less";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";
// Vant 桌面端适配
import "@vant/touch-emulator";

import { i18n } from "@/utils/i18n";

import "vant/lib/index.css";

import * as VueVTable from "@visactor/vue-vtable";

import { Button, CellGroup, Col, Field, Form, Row, Search, Switch } from "vant";

import VzFormRenderer from "@/components/form-renderer/index.vue";

import VzFormTable from "@/components/vz-form-table/index.vue";
import VzFormDatePicker from "@/components/vz-form-date-picker/index.vue";
import VzFormDateTimePicker from "@/components/vz-form-date-time-picker/index.vue";
import VzFormEnumPicker from "@/components/vz-form-enum-picker/index.vue";
import VzFormSwitch from "@/components/vz-form-switch/index.vue";
import VzFormReferPicker from "@/components/vz-form-refer-picker/index.vue";

import VzFormReferPickerItemPerson from "@/components/vz-form-refer-picker/components/person.vue";

import VzFormReferPickerItemQuality from "@/components/vz-form-refer-picker/components/quality.vue";

import VzFormReferPickerItemDepartment from "@/components/vz-form-refer-picker/components/department.vue";
import VzFormReferPickerItemOwnCarStandard from "@/components/vz-form-refer-picker/components/own-car-standard.vue";

import VzFormReferPickerItemFeeType from "@/components/vz-form-refer-picker/components/fee-type.vue";
import VzFormReferPickerItemProduct from "@/components/vz-form-refer-picker/components/product.vue";
import VzFormReferPickerItemWarehouse from "@/components/vz-form-refer-picker/components/warehouse.vue";

import VzFormReferPickerItemCustomer from "@/components/vz-form-refer-picker/components/customer.vue";

import VzFormReferPickerItemFaultType from "@/components/vz-form-refer-picker/components/fault-type.vue";
import VzFormReferPickerItemRegion from "@/components/vz-form-refer-picker/components/region.vue";

// console.info("VzFormDatePicker", VzFormDatePicker);

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */

const app = createApp(App);
const head = createHead();

app.component("vue-list-table", VueVTable.ListTable);
app.component("list-column", VueVTable.ListColumn);

app.component("VzFormTable", VzFormTable);
app.component("VzFormDatePicker", VzFormDatePicker);
app.component("VzFormDateTimePicker", VzFormDateTimePicker);
app.component("VzFormEnumPicker", VzFormEnumPicker);
app.component("VzFormSwitch", VzFormSwitch);

app.component("VzFormReferPicker", VzFormReferPicker);
app.component("VzFormReferPickerItemPerson", VzFormReferPickerItemPerson);
app.component("VzFormReferPickerItemQuality", VzFormReferPickerItemQuality);

app.component("VzFormReferPickerItemFeeType", VzFormReferPickerItemFeeType);
app.component("VzFormReferPickerItemProduct", VzFormReferPickerItemProduct);
app.component("VzFormReferPickerItemWarehouse", VzFormReferPickerItemWarehouse);

app.component("VzFormReferPickerItemCustomer", VzFormReferPickerItemCustomer);

app.component("VzFormReferPickerItemFaultType", VzFormReferPickerItemFaultType);
app.component("VzFormReferPickerItemRegion", VzFormReferPickerItemRegion);
app.component(
  "VzFormReferPickerItemOwnCarStandard",
  VzFormReferPickerItemOwnCarStandard,
);

app.component("VzFormRenderer", VzFormRenderer);

app.component(
  "VzFormReferPickerItemDepartment",
  VzFormReferPickerItemDepartment,
);

app.use(head);
app.use(router);
app.use(pinia);
app.use(i18n);

app.use(Switch);
app.use(Button);
app.use(Field);
app.use(Search);
app.use(CellGroup);
app.use(Form);
app.use(Row);
app.use(Col);
// app.use(VzFormTable)

app.mount("#app");

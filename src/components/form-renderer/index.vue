<script lang="ts" setup>
import type { VzFormExpose, VzFormRendererProps, VzFormSchemaItem } from '@/types/form-designer'
import { useRefs, useStyle } from '@/hooks'

import { getCurrentInstance, reactive, ref, toRefs, useSlots, watch } from 'vue'

import { foreach } from 'tree-lodash'

import { update } from 'lodash-es'

import dayjs, { Dayjs } from 'dayjs'


import type { CreateNewBillParams,HeadCellCheckParams,LoadBillParams, SaveBillParams ,CommitBillParams, RevokeBillParams, CancelBillParams, DeleteBillParams } from "@/types/bills";




import {
  newBillMethod,loadBillMethod ,saveBillMethod, commitBillMethod, revokeBillMethod, cancelBillMethod, deleteBillMethod, headCellCheckMethod
} from '@/api/methods/bills';

// treeFindPath
import { treeFindNode } from '@utopia-utils/core'

defineOptions({
  name: 'VzFormRenderer',
})

const props = withDefaults(defineProps<VzFormRendererProps>(), {})

const emits = defineEmits<{
  validateChange: [name: string | number | string[] | number[], status: boolean, errors: string[] | null]
}>()

dayjs.locale('zh-cn')

const showMoreing = ref(false);

const moreActionOptions = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '朋友圈', icon: 'wechat-moments' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
    { name: '小程序码', icon: 'weapp-qrcode' },
  ],
]

// const COMPONENT_NAME = 'VzFormRendererVant'
const { prefixCls } = useStyle('form-renderer');

const formInstance = ref<any>()

const slots = useSlots()

const toolTabbarActive = ref('');

const slotKeys = Object.keys(slots)

const { refs, toRef } = useRefs<{
  formRef: InstanceType<typeof HTMLElement>
}>()

const currentInstance = getCurrentInstance()

const modeActions = {
  edit: [
    {
      id: '2',
      code: 'save',
      title: '保存',
      icon: 'completed-o',
    },
    {
      id: '3',
      code: 'commit',
      title: '提交',
      icon: 'passed',
    },
    {
      id: '4',
      code: 'save-commit',
      title: '保存提交',
      icon: 'certificate',
    },
  ],
  view: [
    {
      id: '1',
      code: 'edit',
      title: '维护',
      icon: 'edit',
    },

    {
      id: '5',
      code: 'approve',
      title: '审批',
      icon: 'records-o',
    },
    {
      id: '6',
      code: 'more',
      title: '更多',
      icon: 'more-o',
    },
  ],
  approve: [

    {
      id: '5',
      code: 'approve',
      title: '审批',
      icon: 'records-o',
    },
    {
      id: '6',
      code: 'more',
      title: '更多',
      icon: 'more-o',
    },
  ],
  all: [
    {
      id: '1',
      code: 'edit',
      title: '维护',
      icon: 'edit',
    },
    {
      id: '2',
      code: 'save',
      title: '保存',
      icon: 'completed-o',
    },
    {
      id: '3',
      code: 'commit',
      title: '提交',
      icon: 'passed',
    },
    {
      id: '4',
      code: 'save-commit',
      title: '保存提交',
      icon: 'certificate',
    },
    {
      id: '5',
      code: 'approve',
      title: '审批',
      icon: 'records-o',
    },
    {
      id: '6',
      code: 'ellipsis',
      title: '更多',
      icon: 'more-o',
    },
  ],
}

function emitEventHandler(field: string, event: string, params: any) {
  const eo = `${field}-${event}`
  currentInstance.emitsOptions[eo] = null
  // console.log('🚀 ~ file: index.vue:207 ~ emitEventHandler ~ eo:', eo)
  // console.log('🚀 ~ file: index.vue:207 ~ emitEventHandler ~ params:', params)
  emits(eo, params)
}

function onFieldEvents(field: string, params: any) {
  // console.log('🚀 ~ file: index.vue:212 ~ onFieldEvents ~ params:', params)
  const { columnField, event } = params
  const eo = `${field}-${columnField}-${event}`
  emits(eo, params.params)
}

const { data } = toRefs(props);

const formBaseInfo = ref(
  {
    billPrimaryKey: '',
    billTitle: '',
    billName: '',
  }
);

// 处理表单事件 emitsEvents

function parseEvents() {
  // data.value.items[0].item.vant.primaryKey
  // 获取表单基础信息
  formBaseInfo.value.billPrimaryKey = data.value.items[0].item.vant.primaryKey;
  formBaseInfo.value.billTitle = data.value.items[0].item.vant.title;
  formBaseInfo.value.billName = data.value.items[0].item.vant.name;




  // console.info('parseEvents props.data =>', props.data);
  foreach(props.data.items[0].children, (item) => {
    // ARangePicker includes // presets

    if (item.component) {
      if (item.component.events) {
        let emitsEvents = {}
        for (const key in item.component.events) {
          emitsEvents[key] = (...args: any) => {
            let params = reactive({})
            item.component.events[key].map((pkey: string, index: number) => {
              params[pkey] = args[index]
            });
            emitEventHandler(item.item.name, key, params)
          }
        }
        item.component.emitsEvents = emitsEvents
      }

      // if (['ARangePicker'].includes(item.component.name)) {
      //   if (item.component.props.presets?.length) {
      //     item.component.props.presets.forEach((preset) => {
      //       preset.value = [dayjs(preset.value[0]), dayjs(preset.value[1])]
      //     })
      //   }
      // }
    }
  })
}

function reset() {
  formInstance.value?.clearValidate()
  formInstance.value?.resetFields()
}

(async function init() {
  parseEvents()
  console.info('init =>', '...');
})();

/**
 * 查找表单组件节点
 *
 * @param componentItemName model key 模型字段
 *
 * @returns { VzFormSchemaItem | false } 查找到的节点，未找到返回 false
 */
function findComponentNode(componentItemName: string): VzFormSchemaItem | false {
  const findedNode: VzFormSchemaItem = treeFindNode(
    props.data.items[0].children,
    (item: VzFormSchemaItem) => item.item.name === componentItemName,
  )[0]
  console.info('findedNode =>', findedNode)

  if (findedNode) {
    return findedNode
  }
  else {
    console.warn(`没有找到指定 ${componentItemName} 组件节点,请检查...`)
    return false
  }
}

/**
 * 更新表单组件节点
 * @param {string} componentItemName 组件 item.name
 * @param { string|[] } path 路径
 * @param {any} value 更新的值 参数 value
 */
function updateComponentProp(componentItemName: string, path: string | [], value: any) {
  const findedNode = findComponentNode(componentItemName)
  if (findedNode !== false) {
    update(findedNode, path, () => value)
  }
}

/**
 * 更新表单model 数
 * @param {string} fields 组件 item.name
 * @param {any} value 更新的值 参数 value
 * @param {string | []} path 针对要修改的 类型是 数组或对象
 */
function updateFormModel(fields: string, value: any, path?: string | []) {
  // console.info('updateFormModel => fields', fields)
  // console.info('updateFormModel => value', value)

  console.info('formInstance modelRef =>', formInstance.value.modelRef)

  if (path !== undefined) {
    /**
     * TODO
     * 需要增加对 对象 和 数组类型的字段进行修改
     */

    // console.info(`修改对象或数组 formInstance.value.modelRef[${fields}] =>`, formInstance.value.modelRef[fields])
    // console.info('updateFormModel => path', path)
    update(formInstance.value.modelRef[fields], path, () => value)
  }
  else {
    formInstance.value.modelRef[fields] = value
  }

  // const findedNode = findComponentNode(componentItemName);
  // if (findedNode !== false) {
  //   update(findedNode, path, () => value);
  // }
}

function showMoreActions() {
  console.info('showMoreActions =>')
  showMoreing.value = true;
}

function onMoreActionSelect(option: any, index: number) {
  console.info('onMoreActionClick => item', option, index);
  showMoreing.value = false;
}

function onActionEdit() {
  console.info('onToolTabbarChange => edit');

}

async function onActionSave() {


  const { cBIName, caccid } = useBiNameAndCaccid();
  console.info('onToolTabbarChange => save', data.value.model);
  let saveBillParams : SaveBillParams = {
    id: data.value.model[formBaseInfo.value.billPrimaryKey],
    cBIName,
    caccid,
    items: JSON.stringify({ model: data.value.model })
  };

  console.info('saveBillParams =>', saveBillParams);

	const result = await saveBillMethod(saveBillParams);
  console.info('result =>',result);
  if(result) {
    console.info('保存成功');
  }

  // console.info('result =>',result);

  // console.info('onToolTabbarChange => save', data.value.model);

}

function onActionCommit() {
  console.info('onToolTabbarChange => Commit');

}

function onActionSaveCommit() {
  console.info('onToolTabbarChange => SaveCommit');

}

function onActionApprove() {
  console.info('onToolTabbarChange => Approve');

}

function onToolTabbarChange(active) {
  // console.info('onToolTabbarChange => active', active);

  switch (active) {
    case 'edit':
      onActionEdit();
      break
    case 'save':
      onActionSave();
      break
    case 'commit':
      onActionCommit();
      break
    case 'save-commit':
      onActionSaveCommit();
      break
    case 'approve':
      onActionApprove();
      break
    case 'ellipsis':
      showMoreActions();
      break
  }

  toolTabbarActive.value = '';
  // console.info('onToolTabbarChange => default 点了之后，重置状态为空', toolTabbarActive.value);
}

defineExpose<VzFormExpose>({
  refs,
  formInstance: formInstance.value,
  reset,
  findComponentNode,
  updateComponentProp,
  updateFormModel,
} as VzFormExpose)

watch(data, (newVal) => {
  parseEvents()
});
</script>

<template>
  <div class="h-full w-full flex flex-col" :class="[`${prefixCls}`]">
    <div class="min-h-100px flex-1 overflow-hidden" :class="[`${prefixCls}-wrapper`]">
      <van-form

        :ref="toRef('formRef')"
        label-width="85px"
        class="divider-y" :class="[`${prefixCls}-wrapper-form`]"
        v-bind="data.items[0].item"
      >
        <template v-for="(item, index) in data.items[0].children">
          <template v-if="item.type === 'grid-layout'">
            <van-row :key="item.id" class="divider-x">
              <van-col
                v-for="(rowItem, index) in item.children"
                :key="index"
                :span="rowItem.component?.props.span ? rowItem.component?.props.span : 24 / item.children.length"
              >
                <template v-for="ric in rowItem.children" :key="ric.id">


                  <template v-if="ric.component.vant.name === 'VzFormReferPicker'">
                    <component
                      :is="ric.component.vant.name"
                      v-bind="ric.component.vant.props"
                      v-model="data.model"
                      :class="[`${prefixCls}-wrapper-form-item`, ric.component.vant.class]"
                      :label-class="`${prefixCls}-wrapper-form-item-label`"
                      v-on="ric.component?.emitsEvents || {}"
                    />
                  </template>
                  <template v-else>
                    <component
                      :is="ric.component.vant.name"
                      v-bind="ric.component.vant.props"
                      v-model="data.model[data.modelKeys[ric.id].model]"
                      :class="[`${prefixCls}-wrapper-form-item`, ric.component.vant.class]"
                      :label-class="`${prefixCls}-wrapper-form-item-label`"
                      v-on="ric.component?.emitsEvents || {}"
                    />
                  </template>

                </template>
              </van-col>
            </van-row>
          </template>

          <template v-else-if="item.type === 'tabs-layout'">
            <van-row :key="item.id" class="divider-x">
              <van-col

                :span="24"
                class="my-2"
              >
                <van-tabs v-bind="item.component.vant.props">
                  <van-tab v-for="(tab) in item.children" :key="tab.id" :name="tab.id" :title="tab.title">
                    <template v-for="(ric) in tab.children" :key="ric.id">
                      <component
                        :is="ric.component.vant.name"
                        v-bind="ric.component.vant.props"
                        v-model="data.model[data.modelKeys[ric.id].model]"
                        :class="[`${prefixCls}-wrapper-form-item`, ric.component.vant.class]"
                        :label-class="`${prefixCls}-wrapper-form-item-label`"
                        v-on="ric.component?.emitsEvents || {}"
                        @field-events="(params: any) => onFieldEvents(ric.item.name, params)"
                      />
                    </template>
                  </van-tab>
                </van-tabs>
              </van-col>
            </van-row>
          </template>

          <template v-else>
            <template v-if="item.component.vant.name !== 'VzFormTable'">
              <van-row :key="item.id" class="divider-x">
                <van-col :span="24">
                  <!-- <div>{{ item.component.vant.name }}</div> -->
                  <template v-if="Object.hasOwnProperty.call($slots, item.item.slot)">
                    <slot :name="item.item.slot" :item="item" :model="data.model" />
                  </template>

                  <component
                    :is="item.component.vant.name"
                    v-else
                    v-bind="item.component.vant.props"
                    v-model="data.model[data.modelKeys[item.id].model]"
                    :class="[`${prefixCls}-wrapper-form-item`, item.component.vant.class]"
                    :label-class="`${prefixCls}-wrapper-form-item-label`"
                    v-on="item.component?.emitsEvents || {}"
                    @field-events="(params: any) => onFieldEvents(item.item.name, params)"
                  />
                </van-col>
              </van-row>
            </template>

            <template v-else>
              <component
                :is="item.component.vant.name"
                :key="item.id"
                v-bind="item.component.vant.props"
                v-model="data.model[data.modelKeys[item.id].model]"
                v-on="item.component?.emitsEvents || {}"
                @field-events="(params: any) => onFieldEvents(item.item.name, params)"
              />
            </template>
          </template>
        </template>
      </van-form>
    </div>
    <div :class="[`${prefixCls}-tool-bar`]">
      <van-tabbar v-model="toolTabbarActive" @change="onToolTabbarChange">
        <van-tabbar-item v-for="(action) in modeActions.all" :key="action.id" :name="action.code" :icon="action.icon">
          {{ action.title }}
        </van-tabbar-item>
      </van-tabbar>

      <!-- <van-action-bar>
        <van-action-bar-icon v-for="(action) in modeActions.all" :key="action.id" :icon="action.icon" :text="action.title" />

      </van-action-bar> -->
    </div>
  </div>

  <van-share-sheet
    v-model:show="showMoreing"
    title="更多操作"
    :options="moreActionOptions"
    @select="onMoreActionSelect"
  />
</template>

<style lang="less" scoped>
@prefix-cls: ~'vz-form-renderer';

.@{prefix-cls} {
  width: 100%;
  height: 100%;

  &-wrapper {
    &-form {
      border: 1px solid #1677ff;
      .vz-form-renderer-form-item-label {
        height: 100px !important;
        border: 1px solid red !important;
      }

      --van-cell-vertical-padding: 0px;
      --van-cell-horizontal-padding: 0px;
      --van-field-label-margin-right: 4px;

      --van-cell-font-size: 12px;

      &-item {
        :deep(.van-field__value) {
          padding: 4px 2px;
          display: flex;
          align-items: center;
        }

        :deep(&-label) {
          padding: 4px 2px;
          background-color: #e6f4ff;
          line-height: 16px;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  &-tool-bar {
    width: 100%;
    height: 100px;
  }
}
</style>

export interface FileChangeEvent extends Event {
  target: HTMLInputElement & {
    files: FileList; // 文件列表对象
  };
}

export interface VzFormDesignerProps {
  /** 是否展头部 */
  showHeader?: boolean;
  /** 组件配置对象 */
  // formItemProps: VzFormDesignerConfigurationComponentsProps;
  /** 组件配置对象 */
  componentsProps: VzFormDesignerConfigurationComponentsProps;
  /** 组件列表 */
  componentLists: VzFormSchemaItem[];
}

export interface ConfigurationComponent {
  /** 组件名称 */
  name: string;
  /** v-model 字段 */
  vModelField: string;
  /** 组件 props */
  props: Record<string, any>;
  /** 组件事件 */
  events?: VzFormComponentEvents;

  /** 组件类型 */
  type?: string;
}

/** 操作动作 */
export interface operationalAction {
  /** ID 标识 */
  id: string;
  /** 图标  */
  icon: string;
  /** 值 */
  value: string;
  /** 标签 */
  label: string;
}

export interface UILibrary {
  /** ID 标识 */
  id: string;
  /** 名称 */
  name: string;
  /** 图标  */
  icon: string;
  /** 值 */
  value: string;
  /** 版本号 */
  version: string;
}

export interface ComponentProps {
  /** 组件名称  会调整为 name */
  name: string;
  /** 组件事件 */
  events?: VzFormComponentEvents;
  /** 组件属性 */
  props: Record<string, any>;
}

export type UILibraries = UILibrary[];

/** 组件事件 */
export type VzFormComponentEvents = Record<string, string[]>;

export type AdaptedUILibrary = "antdv" | "vant" | "wot";

export type AdaptedUILibraryForm = "AForm" | "VanForm" | "WdForm";

/**
 * 表单项
 */
export interface VzFormSchemaItem {
  /** ID 标识  */
  id: string;
  /** key 标识  作用同 id */
  key: string;
  /** 组件标题 */
  title: string;
  /** 组件图标 */
  icon: string;
  /** 组件类型 */
  type: string;
  /** 表单数据字符 model field */
  vModelField: string;
  /** 表单项（FormItem）配置项  */
  item: {
    [key: string]: any;
    /** 展示状态 */
    displayState: true;
    /** 名称 (model名称) */
    name: string;
    /** 自定义 slot 名称 */
    slot?: string;
  };

  //

  /** 组件相关配置 */

  component: Record<AdaptedUILibrary, ComponentProps>;

  /** 组件属性(props)配置 */
  componentProps: VzFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: VzFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children?: VzFormSchemaItem[];
}

/**
 * 组件属性配置 Prop Configuration
 */
export type VzFormDesignerConfigurationComponentsProps = Record<
  string,
  Record<AdaptedUILibrary, VzFormDesignerConfigurationComponent[]>[]
>;

// export type VzFormDesignerConfigurationComponentsProps = Record<string, VzFormDesignerConfigurationComponent[]>;

export interface VzFormSchemaForm {
  /** ID 标识  */
  id: string;
  /** key 标识  作用同 id */
  key: string;
  /** 组件标题 */
  title: string;
  /** 组件图标 */
  icon: string;
  /** 组件类型 */
  type: string;
  /** 表单数据字符 model field */
  vModelField: string;

  /** UI 组件库 */
  // uiLibrary: AdaptedUILibrary;

  /** 表单项（FormItem）配置项  */
  item: {
    [key: string]: any;
    /** model key */
    name: string;
    /** 展示状态 */
    displayState: true;
    /** 表单标签 是否展示 */
    labelShow: boolean;
    /** label 标签布局 */
    labelCol: {
      /** 标签样式 */
      style: {
        /** 标签宽度 */
        width: string | number;
      };
    };
    /**
     * 表单初始化值
     */
    initialModel: Record<string, string | number | boolean | string[]>;
    /**
     * 表单隐藏字段
     */
    hiddenFields: Record<string, string | number | boolean | string[]>;
  };
  /** 组件相关配置 */
  component: Record<AdaptedUILibrary, ComponentProps>;

  /** 组件属性(props)配置 */
  componentProps: VzFormDesignerConfigurationComponent[];
  /** 表单项（FormItem）属性(props)配置 */
  formItemProps: VzFormDesignerConfigurationComponent[];
  /** 类名 css class name */
  class?: string;
  /** 表单子项目 */
  children: VzFormSchemaItem[];
}

export type VzFormSchemaFormOrItem = VzFormSchemaForm | VzFormSchemaItem;

export type VzFormSchemaModel = Record<
  string,
  string | boolean | number | Array<string | number>
>;

export type VzFormSchemaRules = Record<string, []>;

export interface ModelKey {
  /** ID 组件的唯一标识，关联组件 */
  id: string;
  /** 展示状态 同表单组件的 属性 */
  displayState: boolean;
  /** 表单组件的model key  绑定表单的值 默认值为 id  */
  model: string;
}

//
/** 表单JSON Schema */
export interface VzFormSchema {
  /** 数据 model keys model 需要根据 modelKeys 生成 model 对象 */
  modelKeys: Record<string, ModelKey>;
  /** 数据 model */
  model: VzFormSchemaModel;
  /** 校验规则 rules */
  rules: VzFormSchemaRules;
  /** 表单项目配置 */
  items: [VzFormSchemaForm];
}

export interface VzFormRendererProps {
  /** 表单数据 */
  data: any;
  validateInfos?: object;
  /** 表单渲染模式 */
  renderMode?: string;
  /** bos */
  // bos: any;
  /** 事件前缀 */
  eoPrefix?: string;
}

export interface VzFormExpose {
  /** 表单实例 */
  formInstance: any;
  // 重置表单方法
  // eslint-disable-next-line ts/no-unsafe-function-type
  reset: Function;

  /**
   * 查找表单组件节点
   *
   * @param componentItemName model key 模型字段
   *
   * @returns { VzFormSchemaItem | false } 查找到的节点，未找到返回 false
   */
  // eslint-disable-next-line ts/no-unsafe-function-type
  findComponentNode: Function;
  /**
   * 更新组件节点属性
   */
  // eslint-disable-next-line ts/no-unsafe-function-type
  updateComponentProp: Function;
  /** 更新表单模型 */
  // eslint-disable-next-line ts/no-unsafe-function-type
  updateFormModel: Function;
}

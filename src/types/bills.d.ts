/**
 * 新建业务单 参数
 */
export interface CreateNewBillParams {
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  caccid: string;
  /** 单据类型 固定1  */
  newBillType: number;
}

/**
 * 表头 数据变化检查
 */
export interface HeadCellCheckParams {
  /** id 标识  */
  id: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  caccid: string;
  /** 当前修改字段的 字段名称  */
  itemName: string;
  /** 当前修改字段的 值  */
  val: string;
  /** 当前所有数据 */
  items: string;
}

/**
 * 表体 数据变化检查
 */
export interface BodyCellCheckParams {
  /** id 标识  */
  id: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  caccid: string;
  /** 集合名称 */
  boName: string;
  /** 当前修改字段的 字段名称  */
  itemName: string;
  /** 当前修改字段的 值  */
  val: string;
  /** 当前所有数据 */
  items: string;
  /** 当前BO 表体行数 */
  indexrow: string;
}

/**
 * 载入业务单 参数
 */
export interface LoadBillParams {
  /** id 标识  */
  id: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  caccid: string;
}

/**
 * 保存业务单 参数
 */
export interface SaveBillParams {
  /** id 标识  */
  id: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  caccid: string;
  /** 保存数据项 全部的数据 */
  items: string;
}

/**
 * 提交业务单 参数
 */
export interface CommitBillParams {
  /** 业务单ID  */
  pkMid: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  cAccID: string;
  /** 保存数据项 全部的数据 */
  commIdea: string;
}

/**
 * 撤回业务单 参数
 */
export interface RevokeBillParams {
  /** 业务单ID  */
  pkMid: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  cAccID: string;
}

/**
 * 取消业务单 参数
 */
export interface CancelBillParams {
  /** 业务单ID  */
  pkMid: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  cAccID: string;
}

/**
 * 删除业务单 参数
 */
export interface DeleteBillParams {
  /** 业务单ID  */
  pkMid: string;
  /** 单据名称 */
  cBIName: string;
  /** 账套ID */
  cAccID: string;
}

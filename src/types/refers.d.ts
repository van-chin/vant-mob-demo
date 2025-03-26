export interface RfPerListParams {
  /** 当前页码 */
  pageNum: number;
  /** 每页数量 */
  pageSize: number;
  /** 查询参数 */
  param: string;
  /** 参照名称 */
  cbillname: string;
  /** 附加查询 过滤器 */
  filter: string;
}

/**
 * 产品器材 参照
 */
export interface RfGetInvListParams {
  pageCode: string;
  pageNum: string;
  pageSize: string;
  param: string;
  sFeild: string;
  [property: string]: any;
}

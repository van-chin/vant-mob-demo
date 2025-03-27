import { lanhiAlova } from "../index";

import type {
  BodyCellCheckParams,
  CancelBillParams,
  CommitBillParams,
  CreateNewBillParams,
  DeleteBillParams,
  HeadCellCheckParams,
  LoadBillParams,
  RevokeBillParams,
  SaveBillParams,
} from "@/types/bills";

/**
 * 新建业务单
 * @param params CreateNewBillParams
 * @description 新建业务单
 * @returns
 */
export function newBillMethod(params: CreateNewBillParams) {
  // params.newBillType = 0;

  console.info("newBillMethod params =>", params);
  return lanhiAlova.Post("/Bill/NewBill", params);
}

/**
 * 载入单据
 */
export function loadBillMethod(params: LoadBillParams) {
  console.info("loadBillMethod params =>", params);
  return lanhiAlova.Post("/Bill/LoadBill", params);
}

/**
 * 保存业务单
 */
export function saveBillMethod(params: SaveBillParams) {
  console.info("saveBillMethod params =>", params);
  return lanhiAlova.Post("/Bill/SaveBill", params);
}

/**
 * 保存业务单
 */
export function commitBillMethod(params: CommitBillParams) {
  return lanhiAlova.Post("/Bill/CommitBill", params);
}

/**
 * 撤回业务单
 */
export function revokeBillMethod(params: RevokeBillParams) {
  return lanhiAlova.Post("/Bill/Revoke", params);
}

/**
 * 取消业务单
 */
export function cancelBillMethod(params: CancelBillParams) {
  return lanhiAlova.Post("/Bill/CancelBill", params);
}

/**
 * 删除业务单
 */
export function deleteBillMethod(params: DeleteBillParams) {
  return lanhiAlova.Post("/Bill/DeleteBill", params);
}

/**
 * 表头数据检查
 */
export function headCellCheckMethod(params: HeadCellCheckParams) {
  console.info("headCellCheckMethod params =>", params);
  return lanhiAlova.Post("/Bill/HeadCellCheck", params);
}

/**
 * 表体数据检查
 */
export function bodyCellCheckMethod(params: BodyCellCheckParams) {
  console.info("bodyCellCheckMethod params =>", params);
  return lanhiAlova.Post("/Bill/BodyCellCheck", params);
}

/**
 * 数据项目
 */
export function modifyBillMethod(params: any) {
  console.info("modifyBillMethod params =>", params);
  return lanhiAlova.Post("/Bill/ModifyBill", params);
}

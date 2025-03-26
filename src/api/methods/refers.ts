import { lanhiAlova } from "../index";

/**
 * 员工（人员）参照
 */
export function perListReferMethod(params: object = {}) {
  console.info("perListReferMethod params =>", params);
  return lanhiAlova.Post<any[]>("/Bill/GetPerList", params);
}

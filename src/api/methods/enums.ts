import { lanhiAlova } from "../index";

/**
 * 获取枚举列表
 * @param cAccid 账套ID
 * @description 根据账套获取枚举
 * @returns
 */
export function getEnumsByAcc(cAccid: string): Promise<any> {
  return lanhiAlova.Get(`/Enum/GETEnumRuleByAcc?cAccid=${cAccid}`);
}

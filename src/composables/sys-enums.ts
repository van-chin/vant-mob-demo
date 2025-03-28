import { StorageSerializers, useStorage } from "@vueuse/core";

/**
 *
 * @description 获取 系统所有的枚举数组
 * @returns
 */
export function getAllSysEnums() {
  const sysEnums = useStorage("SYS-ENUMS", [], undefined, {
    serializer: StorageSerializers.object,
  });

  return sysEnums.value;
}

// DO_Sys_EnumRuleDetails_ID: 0;
// DO_Sys_EnumRuleMain_ID: 0;
// bVisible: true;
// bZDY: false;
// cAccID: "WSBizData_SCLH";
// sEnumCode: "01";
// sEnumRuleCaption: "出差任务单-出差国家";
// sEnumRuleName: "EnmOutCooutry";
// sEnumRuleType: "";
// sEnumValue: "亚非国家";
// sEnumValueCN: "亚非国家";
// sEnumValueEN: "False";
// sEnumValueQT: "亚非国家";

/**
 *
 * @description 根据枚举规则名称获取枚举
 * @returns
 */
export function getEnumsByRuleName(ruleName: string) {
  const sysEnums = getAllSysEnums();
  const filteredEnums = sysEnums.filter(
    (item) => item.sEnumRuleName === ruleName,
  );

  let formatedEnums = [];
  filteredEnums.forEach((item) => {
    item.text = item.sEnumValue;
    item.value = item.sEnumCode;
    formatedEnums.push(item);
  });

  return formatedEnums;
}

/**
 *
 * @description 根据枚举说明获取枚举
 * @returns
 */
export function getEnumsByRuleCaption(ruleCaption: string) {
  const sysEnums = getAllSysEnums();
  const filteredEnums = sysEnums.filter(
    (item) => item.sEnumRuleCaption === ruleCaption,
  );
  return filteredEnums;
}

/**
 *
 * @description 获取登录用户的 登录凭证 信息
 * @returns
 */
export function getTokenJwtkeyAcc() {
  const tokenJwtkeyAcc = useStorage("TOKEN-JWTKEY-ACC", {
    token: "",
    jwtkey: "",
    caccid: "",
  });
  return tokenJwtkeyAcc.value;
}

export function getEnumsValueByRuleNameCode(
  ruleName: string,
  code: string = "01",
) {
  const res = getEnumsByRuleName(ruleName);
  const finedIndex = res.findIndex((item) => item.sEnumCode === code);

  if (finedIndex > -1) {
    return res[finedIndex].sEnumValue;
  } else {
    return "";
  }
}

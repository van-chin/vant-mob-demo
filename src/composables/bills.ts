import type { CreateNewBillParams, LoadBillParams } from "@/types/bills";

import {
  newBillMethod,
  loadBillMethod,
  modifyBillMethod,
} from "@/api/methods/bills";

function useBiNameAndCaccid() {
  const tokenJwtkeyAcc = useStorage("TOKEN-JWTKEY-ACC", {
    token: "",
    jwtkey: "",
    caccid: "",
    billName: "",
  });
  const { billName: cBIName, caccid } = tokenJwtkeyAcc.value;

  return {
    cBIName,
    caccid,
  };
}

async function useNewBill() {
  const { cBIName, caccid } = useBiNameAndCaccid();

  const createNewBillParams: CreateNewBillParams = {
    cBIName,
    caccid,
    newBillType: 1,
  };

  const res = await newBillMethod(createNewBillParams);

  // console.info("useNewBill res =>", res);

  return res;
}

async function useLoadBill(billId: string) {
  const { cBIName, caccid } = useBiNameAndCaccid();

  let loadBillParams: LoadBillParams = {
    id: billId,
    cBIName,
    caccid,
  };
  const res = await loadBillMethod(loadBillParams);
  return res;
}

async function useModifyBill(billId: string) {
  const { cBIName, caccid } = useBiNameAndCaccid();
  let loadBillParams: LoadBillParams = {
    cBIName,
    caccid,
    id: billId,
  };
  const res = await modifyBillMethod(loadBillParams);
  return res;
}

export default useNewBill;

export { useNewBill, useLoadBill, useBiNameAndCaccid, useModifyBill };

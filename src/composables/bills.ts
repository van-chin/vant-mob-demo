import type { CreateNewBillParams } from "@/types/bills";

import { newBillMethod } from "@/api/methods/bills";

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

export default useNewBill;

export { useNewBill, useBiNameAndCaccid };

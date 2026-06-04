import crypto from "crypto";

export interface ClickRequestParams {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  error: string;
  error_note?: string;
  sign_time: string;
  sign_string: string;
}


export function generateClickSignature(
  clickTransId: string,
  serviceId: string,
  secretKey: string,
  merchantTransId: string,
  amount: string,
  action: string,
  signTime: string
): string {
  const data = clickTransId + serviceId + secretKey + merchantTransId + amount + action + signTime;
  return crypto.createHash("md5").update(data).digest("hex");
}

export function verifyClickSignature(params: ClickRequestParams, secretKey: string): boolean {
  const generated = generateClickSignature(
    params.click_trans_id,
    params.service_id,
    secretKey,
    params.merchant_trans_id,
    params.amount,
    params.action,
    params.sign_time
  );
  return generated === params.sign_string;
}

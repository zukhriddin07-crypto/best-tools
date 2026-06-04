export const PaymeErrorCodes = {
  TRANSPORT_ERROR: -32300,
  DATABASE_ERROR: -32400,
  SYSTEM_ERROR: -32500,
  INCORRECT_AMOUNT: -31001,
  TRANSACTION_NOT_FOUND: -31003,
  CANT_PERFORM_TRANSACTION: -31008,
  TRANSACTION_BUSY: -31050,
  ORDER_NOT_FOUND: -31050, // -31050 is generally used for order errors
  ALREADY_PAID: -31051,
  CANT_CANCEL_TRANSACTION: -31007,
};

export interface PaymeRpcRequest {
  jsonrpc: string;
  method: string;
  params: any;
  id: number | string;
}

export function formatPaymeError(id: number | string | null, code: number, messageUz: string, messageRu: string, data?: string) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message: messageUz,
      data: {
        uz: messageUz,
        ru: messageRu,
        en: data || messageUz,
      },
    },
  };
}

export function formatPaymeSuccess(id: number | string, result: any) {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

export function verifyPaymeAuth(authHeader: string | null, secretKey: string): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  
  try {
    const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString("ascii");
    const [username, password] = credentials.split(":");
    // Payme sends basic auth with username 'Paycom' and secret key as password
    return username === "Paycom" && password === secretKey;
  } catch (e) {
    return false;
  }
}

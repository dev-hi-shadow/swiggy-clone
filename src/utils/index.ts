import { SECRET_KEY } from "../constants/config";

// Encode
export const encodeId = (id: number): string => {
  return (id ^ (SECRET_KEY as number)).toString(36);
};

// Decode
export const decodeId = (encodedId: string): number => {
  return parseInt(encodedId, 36) ^ SECRET_KEY as number;
};

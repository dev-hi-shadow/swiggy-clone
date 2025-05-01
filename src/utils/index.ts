// utils/idEncoder.ts
import Hashids from "hashids";
import { SECRET_KEY } from "../constants/config";


const hashids = new Hashids(SECRET_KEY, 6); 


export const encodeId = (id: number): string => {
  return hashids.encode(id);
};


export const decodeId = (encodedId: number|string): number => {
  const [decoded] = hashids.decode(String(encodedId));
  return typeof decoded === "number" ? decoded : NaN;
};

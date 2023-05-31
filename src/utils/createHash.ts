import { createHash } from "crypto";

export const creatHash = (string: any) => createHash("md5").update(string).digest("hex");

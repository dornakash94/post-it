import { randText } from "@ngneat/falso";

export const randomBase64WithMime = (): string => {
  const Base64String = Buffer.from(randText(), "binary").toString("base64");
  return "data:image/jpeg;base64," + Base64String;
};

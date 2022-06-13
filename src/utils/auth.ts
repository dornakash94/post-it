import Jwt from "jsonwebtoken";

export interface JwtInstance<T extends object> {
  createToken: (payload: T) => string;
  readToken: (token?: string) => T | undefined;
}

export const initialize = <T extends object>(key: string): JwtInstance<T> => {
  return {
    createToken: (payload: T): string => {
      return Jwt.sign(payload, key);
    },
    readToken: (token?: string): T | undefined => {
      try {
        if (!token) return undefined;

        return Jwt.verify(token, key) as T;
      } catch (e) {
        return undefined;
      }
    },
  };
};

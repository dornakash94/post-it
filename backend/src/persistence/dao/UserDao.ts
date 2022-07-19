import { UserDto } from "../dto/UserDto";

export interface UserDao {
  get: (email: string) => Promise<UserDto | null>;
  getUsersByEmails: (emails: Set<string>) => Promise<Map<string, UserDto>>;
  insert: (userDto: UserDto) => Promise<string | undefined>;
}

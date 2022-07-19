import { UserDto } from "../../dto/UserDto";
import { UserDao } from "../UserDao";
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  author: { type: String, required: true, unique: true },
  author_image: { type: String, required: false },
});

userSchema.plugin(mongooseUniqueValidator);

const mongoUser = mongoose.model<UserDto>("User", userSchema);

const get = (email: string): Promise<UserDto | null> => {
  return mongoUser.findOne({ email }).then((res) => res && mapMongoToDto(res));
};

const getUsersByEmails = async (
  emails: Set<string>
): Promise<Map<string, UserDto>> => {
  const result = new Map<string, UserDto>();

  await mongoUser
    .find({
      email: {
        $in: Array.from(emails),
      },
    })
    .then((userDtos) =>
      userDtos.forEach((userDto) =>
        result.set(userDto.email, mapMongoToDto(userDto))
      )
    );

  return result;
};

const insert = (userDto: UserDto): Promise<string | undefined> => {
  return mongoUser
    .create(userDto)
    .then(() => undefined)
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidatorError) {
        return err.path;
      }

      return err;
    });
};

const mapMongoToDto = (
  res: mongoose.Document<unknown, unknown, UserDto> & UserDto
): UserDto => {
  return {
    email: res.email,
    password: res.password,
    author: res.author,
    author_image: res.author_image,
  };
};

export const dao: UserDao = {
  get,
  getUsersByEmails,
  insert,
};

export default dao;

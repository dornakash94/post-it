import { Post } from "../generated/swagger/post-it";
import { PostDto } from "../persistence/dto/PostDto";
import index from "../";

interface AuthorWithImage {
  author: string;
  author_image?: string;
}

const defaultAuthorWithImage: AuthorWithImage = {
  author: "Unknown",
  author_image: undefined,
};

export const allFields: Set<string> = new Set([
  "id",
  "title",
  "content",
  "image",
  "creationTime",
  "author",
  "author_image",
]);

export const mapPostDtosToPosts = async (
  postDtos: PostDto[],
  fieldMask: Set<string>
): Promise<Post[]> => {
  if (fieldMask.size === 0) {
    return Promise.resolve([]);
  }

  const emailToAuthorWithImage: Map<string, AuthorWithImage> = new Map<
    string,
    AuthorWithImage
  >();

  if (fieldMask.has("author") || fieldMask.has("author_image")) {
    const emails = Array.from(
      new Set(postDtos.map((postDto) => postDto.email))
    );

    await Promise.all(
      emails.map(async (email) => {
        const authorWithImageJsonString = await index.redisClient.get(email);

        if (authorWithImageJsonString) {
          emailToAuthorWithImage.set(
            email,
            JSON.parse(authorWithImageJsonString)
          );
        }
      })
    );

    const needToFetchEmails = emails.filter(
      (email) => !emailToAuthorWithImage.has(email)
    );

    if (needToFetchEmails.length > 0) {
      (
        await index.userDao.getUsersByEmails(new Set(needToFetchEmails))
      ).forEach((userDto) => {
        const authorWithImage: AuthorWithImage = {
          author: userDto.author,
          author_image: userDto.author_image,
        };

        index.redisClient.set(userDto.email, JSON.stringify(authorWithImage), {
          EX: 60 * 10,
        });

        emailToAuthorWithImage.set(userDto.email, authorWithImage);
      });
    }
  }

  return Promise.all(
    postDtos.map((postDto: PostDto) =>
      mapPostDtoToPost(postDto, fieldMask, (email: string) =>
        Promise.resolve(
          emailToAuthorWithImage.get(email) || defaultAuthorWithImage
        )
      )
    )
  );
};

export const mapPostDtoToPost = async (
  postDto: PostDto,
  fieldMask: Set<string> = allFields,
  emailToAuthorWithImage: (
    email: string
  ) => Promise<AuthorWithImage> = defaultEmailToAuthorWithImage
): Promise<Post> => {
  if (fieldMask.size === 0) return {};

  const getAuthorAndImage = (): Promise<AuthorWithImage | undefined> => {
    if (fieldMask.has("author") || fieldMask.has("author_image")) {
      return emailToAuthorWithImage(postDto.email);
    }

    return Promise.resolve(undefined);
  };

  const authorAndImage = await getAuthorAndImage();

  return {
    id: fieldMask.has("id") ? postDto.id : undefined,
    title: fieldMask.has("title") ? postDto.title : undefined,
    content: fieldMask.has("content") ? postDto.content : undefined,
    image: fieldMask.has("image") ? postDto.image : undefined,
    creationTime: fieldMask.has("creationTime")
      ? postDto.creationTime
      : undefined,
    author: fieldMask.has("author") ? authorAndImage?.author : undefined,
    author_image: fieldMask.has("author_image")
      ? authorAndImage?.author_image
      : undefined,
  };
};

const defaultEmailToAuthorWithImage = async (
  email: string
): Promise<AuthorWithImage> => {
  const authorWithImageJsonStr = await index.redisClient.get(email);

  if (authorWithImageJsonStr) {
    return JSON.parse(authorWithImageJsonStr);
  }

  const user = await index.userDao.get(email);

  if (user) {
    const authorWithImage = {
      author: user.author,
      author_image: user.author_image,
    };

    index.redisClient.set(email, JSON.stringify(authorWithImage), {
      EX: 60 * 10,
    });

    return authorWithImage;
  }

  return defaultAuthorWithImage;
};

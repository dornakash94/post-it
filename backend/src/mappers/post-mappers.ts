import { Post, PostSummary } from "../generated/swagger/post-it";
import { PostDto } from "../persistence/dto/PostDto";
import index from "../";

export const mapPostDtosToPosts = async (
  postDtos: PostDto[]
): Promise<Post[]> => {
  const emails = Array.from(new Set(postDtos.map((postDto) => postDto.email)));
  const emailToAuthor: Map<string, string> = new Map<string, string>();

  await Promise.all(
    emails.map(async (email) => {
      const author = await index.redisClient.get(email);

      if (author) {
        emailToAuthor.set(email, author);
      }
    })
  );

  const needToFetchEmails = emails.filter((email) => !emailToAuthor.has(email));

  if (needToFetchEmails.length > 0) {
    (await index.userDao.getUsersByEmails(new Set(needToFetchEmails))).forEach(
      (userDto) => {
        index.redisClient.set(userDto.email, userDto.author, { EX: 60 * 10 });
        emailToAuthor.set(userDto.email, userDto.author);
      }
    );
  }

  return Promise.all(
    postDtos.map((postDto: PostDto) =>
      mapPostDtoToPost(postDto, (email: string) =>
        Promise.resolve(emailToAuthor.get(email) || "Unknown")
      )
    )
  );
};

export const mapPostDtoToPost = async (
  postDto: PostDto,
  emailToAuthor: (email: string) => Promise<string> = defaultEmailToAuthor
): Promise<Post> => {
  const author = await emailToAuthor(postDto.email);

  return {
    id: postDto.id,
    title: postDto.title,
    content: postDto.content,
    image: postDto.image,
    creationTime: postDto.creationTime,
    author,
  };
};

export const mapPostToPostSummary = (posts: Post[]): PostSummary[] => {
  return posts.map((post) => {
    return {
      id: post.id,
      title: post.title,
      author: post.author,
    };
  });
};

const defaultEmailToAuthor = async (email: string): Promise<string> => {
  const author = await index.redisClient.get(email);

  if (author) {
    return author;
  }

  const user = await index.userDao.get(email);

  if (user) {
    index.redisClient.set(email, user.author, { EX: 60 * 10 });
  }

  return user ? user.author : "Unknown";
};

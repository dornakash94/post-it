import { Post } from "../generated/swagger/post-it";

interface PostProps {
  post: Post;
}

function PostComp(props: PostProps) {
  const { post } = props;
  return <div />;
}

export default PostComp;

import { Accordion } from "react-bootstrap";
import { Post } from "../generated/swagger/post-it";
import PostsComp from "./post";

interface PostListProps {
  posts: Post[];
}

function PostListComp(props: PostListProps) {
  if (props.posts.length > 0) {
    return (
      <Accordion defaultActiveKey="0">
        {props.posts.map((post) => {
          return <PostsComp post={post} key={post.id} />;
        })}
      </Accordion>
    );
  } else return <div>No posts</div>;
}
export default PostListComp;

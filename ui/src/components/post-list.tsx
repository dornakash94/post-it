import { Accordion } from "react-bootstrap";
import { PostSummary } from "../generated/swagger/post-it";
import PostSummaryComp from "./post-summary";

interface PostListProps {
  postSummaries: PostSummary[];
}

function PostListComp(props: PostListProps) {
  if (props.postSummaries.length > 0) {
    return (
      <Accordion defaultActiveKey="0">
        {props.postSummaries.map((postSummary) => {
          return <PostSummaryComp postSummary={postSummary} />;
        })}
      </Accordion>
    );
  } else return <div>No posts</div>;
}
export default PostListComp;

import { Accordion } from "react-bootstrap";
import { PostSummary } from "../generated/swagger/post-it";

interface PostSummaryProps {
  postSummary: PostSummary;
}

function PostSummaryComp(props: PostSummaryProps) {
  const { postSummary } = props;
  const onBodyClicked = () => {
    console.log("sgs");
  };

  return (
    <Accordion.Item eventKey={postSummary.id!.toString()}>
      <Accordion.Header>
        {postSummary.title}
        {postSummary.author}
      </Accordion.Header>
      <Accordion.Body onClick={onBodyClicked}></Accordion.Body>
    </Accordion.Item>
  );
}

export default PostSummaryComp;

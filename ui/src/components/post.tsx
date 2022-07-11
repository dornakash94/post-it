import { Button, Card } from "react-bootstrap";

import { Post } from "../generated/swagger/post-it";

interface PostsProps {
  post: Post;
}

function PostsComp(props: PostsProps) {
  const { post } = props;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={post.image!} />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <Button variant="primary">Edit</Button>
      </Card.Body>
    </Card>
  );
}

export default PostsComp;

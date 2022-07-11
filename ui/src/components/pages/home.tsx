import { api } from "../../gateway/post-it";

import { useSelector } from "react-redux";
import { accountSelector } from "../../store";
import PostListComp from "../post-list";

import PaginationComponent from "../pagination";
import { Post } from "../../generated/swagger/post-it";
import PostCreator from "../post-creator";

const allFields: string[] = [
  "id",
  "title",
  "content",
  "image",
  "creationTime",
  "author",
  "author_image",
];

function Home() {
  const account = useSelector(accountSelector);
  if (!account?.token) return <div />;

  const token = account.token;

  const fetchPage = async (
    pageNumber: number,
    pageSize: number
  ): Promise<Post[]> => {
    const getAllPostsResponse = await api.posts.getAllPosts(
      {
        "page-number": pageNumber,
        "page-size": pageSize,
        "field-mask": allFields,
      },
      { headers: { Authorization: token } }
    );

    return getAllPostsResponse.data.posts || [];
  };

  const render = (posts: Post[]): JSX.Element => {
    return <PostListComp posts={posts} />;
  };

  return (
    <div style={{ margin: "auto", maxWidth: 300 }}>
      <PostCreator />
      <br />
      <PaginationComponent fetchPage={fetchPage} render={render} pageSize={9} />
    </div>
  );
}

export default Home;

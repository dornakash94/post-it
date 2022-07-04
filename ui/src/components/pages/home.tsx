import { api } from "../../gateway/post-it";

import { useDispatch, useSelector } from "react-redux";
import { accountSelector, postSummariesSelector } from "../../store";
import React from "react";
import { setPostSummaries } from "../../store/reducers/post-reducer";
import PostSummaryComp from "../post-summary";
import PostListComp from "../post-list";

function Home() {
  const account = useSelector(accountSelector);
  if (!account?.token) return <div />;

  const dispatch = useDispatch();
  const postSummaries = useSelector(postSummariesSelector);

  const [state, setState] = React.useState({
    loading: true,
  });

  const fetchPosts = async (token: string) => {
    const getAllPostsResponse = await api.posts.getAllPosts(
      {},
      { headers: { Authorization: token } }
    );

    const postSummaries = getAllPostsResponse.data.postsSummaries;

    if (postSummaries) {
      dispatch(setPostSummaries(postSummaries));
    }

    setState({ ...state, loading: false });
  };

  React.useEffect(() => {
    account.token && fetchPosts(account.token);
  }, []);

  const renderPosts = () => {
    return <PostListComp postSummaries={postSummaries} />;
  };

  const renderLoader = () => {
    return <div>Loading</div>;
  };

  return (
    <div>
      <div style={{ margin: "auto", maxWidth: 300 }}>
        {state.loading ? renderLoader() : renderPosts()}
      </div>
    </div>
  );
}

export default Home;

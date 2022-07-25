import { useDispatch, useSelector } from "react-redux";
import store, { accountSelector, postStateSelector } from "../../store";
import PostListComp from "../post-list";

import PostCreator from "../post-creator";
import { addPosts } from "../../store/reducers/post-reducer";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { apiWrapper } from "../../gateway/post-it";

function Home() {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const { posts } = useSelector(postStateSelector);

  const [pagination, setPagination] = React.useState({
    pageNumber: 0,
    pageSize: 9,
    showLoadMore: false,
  });

  useEffect(() => {
    const getMore = async () => {
      try {
        const posts = store.getState().post.posts;
        const fromId = posts.length > 0 ? posts[0].id : 0;

        const additionalPosts = await apiWrapper.posts.getAllPosts(
          dispatch,
          token,
          0,
          9,
          fromId
        );
        dispatch(addPosts(additionalPosts));

        if (posts.length === 0) {
          setPagination({
            ...pagination,
            showLoadMore: additionalPosts.length === pagination.pageSize,
          });
        }
      } finally {
        setTimeout(getMore, 3000);
      }
    };

    if (account?.token) {
      getMore();
    }
  }, [account?.token]);

  if (!account?.token) return <div />;

  const token = account.token;

  const loadMore = async () => {
    const additionalPosts = await apiWrapper.posts.getAllPosts(
      dispatch,
      token,
      pagination.pageNumber + 1,
      pagination.pageSize
    );

    if (additionalPosts.length > 0) {
      dispatch(addPosts(additionalPosts));
      setPagination({
        pageNumber: pagination.pageNumber + 1,
        pageSize: pagination.pageSize,
        showLoadMore: additionalPosts.length === pagination.pageSize,
      });
    } else {
      setPagination({
        ...pagination,
        showLoadMore: false,
      });
    }
  };

  return (
    <div className="center-div">
      <PostCreator />
      <br />
      <PostListComp posts={posts} />
      {pagination.showLoadMore && <Button onClick={loadMore}>Load more</Button>}
    </div>
  );
}

export default Home;

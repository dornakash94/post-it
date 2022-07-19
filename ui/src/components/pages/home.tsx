import { useDispatch, useSelector } from "react-redux";
import store, { accountSelector, postStateSelector } from "../../store";
import PostListComp from "../post-list";

import PostCreator from "../post-creator";
import { addPosts } from "../../store/reducers/post-reducer";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { apiWrapper } from "../../gateway/post-it";

function Home() {
  const account = useSelector(accountSelector);
  if (!account?.token) return <div />;
  const dispatch = useDispatch();
  const { posts } = useSelector(postStateSelector);
  const token = account.token;

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

    getMore();
  }, []);

  const loadMore = async () => {
    const additionalPosts = await apiWrapper.posts.getAllPosts(
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
    <div style={{ margin: "auto", maxWidth: 300 }}>
      <PostCreator />
      <br />
      <PostListComp posts={posts} />
      {pagination.showLoadMore && <Button onClick={loadMore}>Load more</Button>}
    </div>
  );
}

export default Home;

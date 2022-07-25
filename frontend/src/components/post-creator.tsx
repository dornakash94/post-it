import React from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../generated/swagger/post-it";
import { apiWrapper } from "../gateway/post-it";
import { accountSelector } from "../store";
import Avatar from "./avatar";
import uploadIcon from "../resources/upload.png";
import { addPosts } from "../store/reducers/post-reducer";

export default () => {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const [formData, setFormData] = React.useState({
    post: {} as Post,
    loading: false,
    error: "",
  });

  if (!account?.token) return <div />;
  const { token } = account;

  const onImageChange = (files: FileList) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          post: { ...formData.post, image: e.target?.result as string },
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        post: { ...formData.post, image: undefined },
      });
    }
  };

  const sendPost = async () => {
    try {
      const createPostResponse = await apiWrapper.posts.createPost(
        dispatch,
        token,
        formData.post
      );

      setFormData({
        ...formData,
        loading: false,
        post: {},
      });
      if (createPostResponse) {
        dispatch(addPosts([createPostResponse]));
      }
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
        error: String(error),
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setFormData({ ...formData, loading: true, error: "" });
    sendPost();
  };

  return (
    <div style={{ width: "24rem" }}>
      <Form className="mb-0" onSubmit={handleSubmit}>
        <Avatar
          image={account.author_image}
          className="avatar-image-icon float-left"
        />
        <h5 style={{ marginLeft: 5, marginTop: 13, float: "left" }}>
          {account.author}
        </h5>
        <Form.Control
          minLength={1}
          type="text"
          placeholder="Title"
          autoFocus
          onChange={(e) =>
            setFormData({
              ...formData,
              post: { ...formData.post, title: e.target.value },
            })
          }
          value={formData.post.title || ""}
        />
        {formData.post.image && (
          <img
            src={formData.post.image}
            style={{ width: "24rem", height: 250 }}
          />
        )}
        <Form.Control
          type="text"
          as="textarea"
          rows={3}
          placeholder="Content"
          onChange={(e) =>
            setFormData({
              ...formData,
              post: { ...formData.post, content: e.target.value },
            })
          }
          value={formData.post.content || ""}
        />
        <br />
        <div style={{ height: 38, width: "24rem" }}>
          <div style={{ float: "right" }}>
            <label className="input-label">
              <img src={uploadIcon} style={{ width: 25, height: 25 }} />
              <input
                type="file"
                id="file-input"
                accept={".jpg"}
                onChange={(e: any) => onImageChange(e.target.files)}
              />
            </label>
            <span>&nbsp;&nbsp;</span>
            <Button variant="primary" type="submit">
              Share
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

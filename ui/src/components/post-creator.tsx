import React from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Post } from "../generated/swagger/post-it";
import { api } from "../gateway/post-it";
import { accountSelector } from "../store";
import Avatar from "./avatar";
import uploadIcon from "../resources/upload.png";

export default () => {
  const account = useSelector(accountSelector);
  if (!account?.token) return <div />;

  const [formData, setFormData] = React.useState({
    post: {} as Post,
    loading: false,
    error: "",
  });

  const onImageChange = (files: FileList) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          post: { ...formData.post, image: e.target!.result as string },
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
      await api.posts.createPost(
        {
          post: formData.post,
        },
        { headers: { Authorization: account.token! } }
      );

      setFormData({
        ...formData,
        loading: false,
        post: {},
      });
    } catch (error) {
      const errorMessage = () => {
        if (error instanceof Response) {
          switch (error.status) {
            case 400:
              return "invalid input";
            default:
              break;
          }
        }
        return "something bad happened";
      };

      setFormData({
        ...formData,
        loading: false,
        error: errorMessage(),
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setFormData({ ...formData, loading: true, error: "" });
    sendPost();
  };

  return (
    <div>
      <Form
        style={{
          flex: 4000,
        }}
        className="mb-0"
        onSubmit={handleSubmit}
      >
        <Avatar
          image={account.author_image}
          style={{ width: 40, height: 40, marginRight: 250 }}
        />
        <Form.Control
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
          <img src={formData.post.image} style={{ width: 250, height: 250 }} />
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
        <div style={{ height: 38, width: 300 }}>
          <div style={{ float: "right" }}>
            <label className="input-label">
              <img src={uploadIcon} style={{ width: 25, height: 25 }} />
              <input
                type="file"
                id="file-input"
                accept={".png"}
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

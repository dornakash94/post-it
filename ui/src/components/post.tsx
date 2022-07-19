import React from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiWrapper } from "../gateway/post-it";
import uploadIcon from "../resources/upload.png";

import { Post } from "../generated/swagger/post-it";
import { accountSelector } from "../store";
import { addPosts, deletePost } from "../store/reducers/post-reducer";
import Avatar from "./avatar";

interface PostsProps {
  post: Post;
}

function PostsComp({ post }: PostsProps) {
  const [formData, setFormData] = React.useState({
    post,
    editMode: false,
    error: "",
    openDialog: false,
  });

  const account = useSelector(accountSelector);

  if (!account?.token) return <div />;

  const { token } = account;
  const dispatch = useDispatch();

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

  const onConfirmDelete = () => {
    apiWrapper.posts
      .deletePost(post.id!, token)
      .then(() => dispatch(deletePost(post.id!)))
      .catch((e: { status: any }) => {
        if (e instanceof Response) {
          switch (e.status) {
            case 404:
              dispatch(deletePost(post.id!));
              return;
            default:
              break;
          }
        }

        throw e;
      });
  };

  const onDialogClick = (openDialog: boolean) => {
    setFormData({ ...formData, openDialog });
  };

  const editPost = async () => {
    if (formData.post === post) {
      setFormData({
        ...formData,
        editMode: false,
      });
      return;
    }

    try {
      const editPostResponse = await apiWrapper.posts.editPost(
        formData.post.id!,
        formData.post,
        token
      );

      setFormData({
        ...formData,
        editMode: false,
      });
      if (editPostResponse) {
        dispatch(addPosts([editPostResponse]));
      }
    } catch (error) {
      setFormData({
        ...formData,
        error: String(error),
      });
    }
  };

  const ChangeEditMode = (editMode: boolean) => {
    setFormData({ ...formData, editMode });
  };

  const showPost = () => {
    return (
      <Card.Body>
        <Card.Title>{formData.post.title}</Card.Title>
        <Card.Text>{formData.post.content}</Card.Text>
        {account.author === formData.post.author && (
          <Button
            style={{ float: "left" }}
            variant="danger"
            onClick={() => onDialogClick(true)}
          >
            Delete
          </Button>
        )}
        {account.author === formData.post.author && (
          <Button
            onClick={() => ChangeEditMode(true)}
            style={{ float: "right" }}
            variant="primary"
          >
            Edit
          </Button>
        )}
      </Card.Body>
    );
  };

  const editPostForm = () => {
    return (
      <Card.Body>
        <Card.Title>
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
        </Card.Title>
        <Card.Text>
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
        </Card.Text>

        <label className="input-label">
          <img src={uploadIcon} style={{ width: 25, height: 25 }} />
          <input
            type="file"
            id="file-input"
            accept={".jpg"}
            onChange={(e: any) => onImageChange(e.target.files)}
          />
        </label>

        <Button onClick={editPost} style={{ float: "right" }} variant="primary">
          Share
        </Button>
        <Button
          style={{ float: "left" }}
          onClick={() => setFormData({ ...formData, post, editMode: false })}
        >
          Cancel
        </Button>
      </Card.Body>
    );
  };

  return (
    <div>
      <Modal show={formData.openDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Delete post</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onDialogClick(false)}>
            No
          </Button>
          <Button variant="danger" onClick={onConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Card style={{ width: "24rem", margin: "auto" }}>
        <Card.Header style={{ height: 55 }}>
          <Avatar
            image={post.author_image}
            style={{ width: 40, height: 40, float: "left" }}
          />
          <h6 style={{ marginLeft: 6, marginTop: 16, float: "left" }}>
            {post.author}
          </h6>
        </Card.Header>
        {formData.post.image && (
          <Card.Img variant="top" src={formData.post.image} />
        )}
        {formData.editMode ? editPostForm() : showPost()}
      </Card>
    </div>
  );
}

export default PostsComp;

import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { apiWrapper } from "../../gateway/post-it";
import { setAccount } from "../../store/reducers/user-reducer";
import Avatar from "../avatar";

function Register() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    authorImage: undefined as string | undefined,
    author: "",
    loading: false,
    error: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: React.FormEvent) => {
    if (
      formData.password !== formData.confirmPassword ||
      formData.author.length < 4
    ) {
      event.preventDefault();
      return;
    }

    setFormData({ ...formData, loading: true });
    await doRegister();
  };

  const onImageChange = (files: FileList) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setFormData({
          ...formData,
          authorImage: e.target!.result as string,
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        authorImage: undefined,
      });
    }
  };

  const doRegister = async () => {
    try {
      const registerResponse = await apiWrapper.user.register(
        formData.email,
        formData.password,
        formData.author,
        formData.authorImage
      );

      dispatch(setAccount(registerResponse));

      const locationState = location.state as { from?: Location };
      const from = locationState?.from?.pathname || "/";

      if (from === "/logout" || from === "/404") navigate("/");
      else navigate(from);
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
        error: String(error),
      });
    }
  };

  const renderForm = () => {
    return (
      <div>
        <Form className="mb-0" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              isInvalid={!formData.email.includes("@")}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              value={formData.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <InputGroup hasValidation={true}>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                isInvalid={formData.password.length < 4}
                minLength={4}
                value={formData.password}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <InputGroup hasValidation={true}>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                value={formData.confirmPassword}
                isInvalid={
                  formData.confirmPassword !== "" &&
                  formData.password !== formData.confirmPassword
                }
                minLength={4}
              />
              <Form.Control.Feedback type="invalid">
                Passwords must match
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              value={formData.author}
              minLength={4}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImage">
            <Avatar image={formData.authorImage} />

            <Form.Control
              type="file"
              accept={".jpg"}
              onChange={(e: any) => onImageChange(e.target.files)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            sign up
          </Button>
        </Form>

        {formData.error.length > 0 && (
          <p style={{ color: "red" }}>{formData.error}</p>
        )}
      </div>
    );
  };

  const renderLoader = () => {
    return <div>Loading</div>;
  };

  return (
    <div>
      <div style={{ margin: "auto", maxWidth: 300 }}>
        {formData.loading ? renderLoader() : renderForm()}
      </div>
    </div>
  );
}

export default Register;

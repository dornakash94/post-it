import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../gateway/post-it";

function Register() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    loading: false,
    error: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: React.FormEvent) => {
    if (
      formData.password !== formData.confirmPassword ||
      formData.name.length < 4
    ) {
      event.preventDefault();
      return;
    }

    setFormData({ ...formData, loading: true });
    await doRegister();
  };

  const doRegister = async () => {
    try {
      const registerResponse = await api.user.register({
        email: formData.email,
        password: formData.password,
        author: formData.name,
      });

      const token = registerResponse.data.account?.token;
      localStorage.setItem(
        "account",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        JSON.stringify(registerResponse.data.account!)
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      localStorage.setItem("token", token!);

      const locationState = location.state as { from?: Location };
      const from = locationState?.from?.pathname || "/";

      if (from === "/logout" || from === "/404") navigate("/");
      else navigate(from);
    } catch (error) {
      const errorMessage = () => {
        if (error instanceof Response) {
          switch (error.status) {
            case 400:
              return "invalid input";
            case 409:
              return "account already exists";
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

  const renderForm = () => {
    return (
      <div>
        <Form className="mb-0" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
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
                value={formData.password}
                isInvalid={formData.password.length < 4}
                minLength={4}
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
                setFormData({ ...formData, name: e.target.value })
              }
              value={formData.name}
              minLength={4}
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

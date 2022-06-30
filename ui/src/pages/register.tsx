import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { api } from "../gateway/post-it";

function Register() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    stayConnected: false,
    loading: false,
    error: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    if (formData.password !== formData.confirmPassword) event.preventDefault();
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

      //const token = registerResponse.data.account?.token;
      //todo success
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
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              value={formData.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
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

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="keep me logged in"
              style={{ fontSize: 15, margin: "auto", maxWidth: 150 }}
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
      <h2>Welcome to post-it!</h2>
      <br />

      <div style={{ margin: "auto", maxWidth: 300 }}>
        {formData.loading ? renderLoader() : renderForm()}
      </div>
    </div>
  );
}

export default Register;

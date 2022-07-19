import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { apiWrapper } from "../../gateway/post-it";
import { setAccount } from "../../store/reducers/user-reducer";

function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    loading: false,
    error: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    setFormData({ ...formData, loading: true });
    await doLogin();
  };

  const doLogin = async () => {
    try {
      const loginResponse = await apiWrapper.user.login(
        formData.email,
        formData.password
      );

      dispatch(setAccount(loginResponse));

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

          <Button variant="primary" type="submit">
            login
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
export default Login;

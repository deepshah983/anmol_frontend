import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { Eye, EyeOff } from "lucide-react";

//redux
import { useSelector, useDispatch } from "react-redux";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import profile from "../../assets/images/vishal-4-wealth-whithout-background-yellow.png";
import logo from "../../assets/images/ishan_group_logo.png";
import backgroundVideo from "../../assets/video/219832_small.mp4";

const Login = (props) => {
  //meta title
  document.title = "Login | Vishal Wealth Admin & Dashboard Template";
  const dispatch = useDispatch();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  const signIn = (type) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //for facebook and google authentication
  const socialResponse = (type) => {
    signIn(type);
  };

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <div className="row mb-4">
            <div className="col-xl-12 text-center">
              <a href="/">
                <img
                  src={profile}
                  alt="Vishal Wealth Login"
                  className="img-fluid"
                  height="100px"
                  width="230px"
                />
              </a>
            </div>
          </div>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={12}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary m-0">Welcome Back !</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-2">
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email &&
                              validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                                validation.errors.password
                                ? true
                                : false
                            }
                          />
                          <span
                            className="input-group-text"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </span>
                        </div>
                        {validation.touched.password &&
                          validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>

                      <div className="mt-1 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>

                      <div className="mt-1 text-center">
                        <span className="text-muted">
                          Don't have an account?{" "}
                          <Link
                            to="/register"
                            className="font-weight-medium text-primary"
                          >
                            Register
                          </Link>
                        </span>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};

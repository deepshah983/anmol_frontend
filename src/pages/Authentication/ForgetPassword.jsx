import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

import { postData } from '../../components/api';
import { ToastElement, success, error } from "../../components/toast";

// import images
//import logo from "../../assets/images/logo.svg";
import logo from "../../assets/images/vishal-4-wealth.png";

const ForgetPasswordPage = (props) => {
  //meta title
    document.title = "Forget Password | Vishal Wealth Admin & Dashboard Template";
 
    const [isAuthEmail, setIsAuthEmail] = useState(null);
    const [isAuthOtp, setIsAuthOtp] = useState(null);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
     
      handleUpdate(values)
    },
  });


  const validationOtp = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      clientOTP: "",
      userId: userId
    },
    validationSchema: Yup.object({
      clientOTP: Yup.string().required("Please Enter Your OTP"),
    }),
    onSubmit: (values) => {
     
      verifyOtp(values)
    },
  });
  
  const validationPass = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      new_password: "",
      confirm_password: "",
      user_id: userId
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .required('Please Enter Your New Password')
        .min(6, 'Password must be at least 6 characters long'), // Adjust the minimum length as needed
        confirm_password: Yup.string()
        .required('Please Confirm Your New Password')
        .oneOf([Yup.ref('new_password'), null], 'New and Confirm Passwords must match'),
    }),
    onSubmit: (values) => {
     
      changePassword(values)
    },
  });
  const handleUpdate = (values) => {
  
    postData('/authorization/email-auth', values).then((res) => {
      if (res.data.error == true) {
        return error(res.data.message);
      }
    
      setUserId(res.data.data.userId);
      setEmail(values.email);
      setIsAuthEmail("verify")
      
       return success(res.data.message);
    });
};


const verifyOtp = (values) => {
  
   postData('/authorization/verify-otp', values).then((res) => {
     if (res.data.error == true) {
       return error(res.data.message);
     }
     
     
     setIsAuthOtp("verify")
      return success(res.data.message);
      
      
   });
};

const onHandleClickVerifyOtp = (e) => {
  e.preventDefault();
  const values = {email: email};
  postData('/authorization/email-auth', values).then((res) => {
    if (res.data.error == true) {
      return error(res.data.message);
    }
     return success(res.data.message);
     
  });
};



const changePassword = (values) => {
  
   postData('/authorization/change-password-otp', values).then((res) => {
     if (res.data.error == true) {
       return error(res.data.message);
     }
      window.location.href = "/login";
   });
};

  const { forgetError, forgetSuccessMsg } = useSelector((state) => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));

  return (
    <React.Fragment>
     
      <div className="account-pages my-5 pt-sm-5">
        <Container>
        <div>
                  <div className="row mb-4">
                  <div className="col-xl-12 text-center">
                    <a href="/">
                      <img src={logo} alt="Vishal Wealth Login" className="img-fluid" height="100px" width="230px" />
                    </a>
                  </div>
              </div>
                  </div>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary mb-0">Welcome Back !</h5>
                      
                      </div>
                    </Col>
                    <Col className=" align-self-end">
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-2">
                {(isAuthEmail === null) ? ( 
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
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
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                            style={{ width: "100%" }}
                          >
                            Verify
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  ) : isAuthOtp === null ? (
                    <div className="p-2">
                  {forgetError && forgetError ? (
                    <Alert color="danger" style={{ marginTop: "13px" }}>
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert color="success" style={{ marginTop: "13px" }}>
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null}

                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationOtp.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">OTP</Label>
                      <Input
                        name="clientOTP"
                        className="form-control"
                        placeholder="Enter OTP"
                        type="number"
                        onChange={validationOtp.handleChange}
                        onBlur={validationOtp.handleBlur}
                        value={validationOtp.values.clientOTP || ""}
                        invalid={
                          validationOtp.touched.clientOTP && validationOtp.errors.clientOTP
                            ? true
                            : false
                        }
                      />
                      {validationOtp.touched.clientOTP && validationOtp.errors.clientOTP ? (
                        <FormFeedback type="invalid">
                          {validationOtp.errors.clientOTP}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <a href="javascript:void(0);" onClick={onHandleClickVerifyOtp}>
                    Resend OTP
                  </a>
                    <Row className="mb-3">
                      <Col className="text-end">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          style={{ width: "100%" }}
                        >
                          Verify
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </div>
                  ) : 
                  
                  <div className="p-2">
                  {forgetError && forgetError ? (
                    <Alert color="danger" style={{ marginTop: "13px" }}>
                      {forgetError}
                    </Alert>
                  ) : null}
                  {forgetSuccessMsg ? (
                    <Alert color="success" style={{ marginTop: "13px" }}>
                      {forgetSuccessMsg}
                    </Alert>
                  ) : null}

                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validationPass.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">New Password</Label>
                      <Input
                        name="new_password"
                        className="form-control"
                        placeholder="Enter New Password"
                        type="password"
                        onChange={validationPass.handleChange}
                        onBlur={validationPass.handleBlur}
                        value={validationPass.values.new_password || ""}
                        invalid={
                          validationPass.touched.new_password && validationPass.errors.new_password
                            ? true
                            : false
                        }
                      />
                      {validationPass.touched.new_password && validationPass.errors.new_password ? (
                        <FormFeedback type="invalid">
                          {validationPass.errors.new_password}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Confirm Password</Label>
                      <Input
                        name="confirm_password"
                        className="form-control"
                        placeholder="Enter Confirm Password"
                        type="password"
                        onChange={validationPass.handleChange}
                        onBlur={validationPass.handleBlur}
                        value={validationPass.values.confirm_password || ""}
                        invalid={
                          validationPass.touched.confirm_password && validationPass.errors.confirm_password
                            ? true
                            : false
                        }
                      />
                      {validationPass.touched.confirm_password && validationPass.errors.confirm_password ? (
                        <FormFeedback type="invalid">
                          {validationPass.errors.confirm_password}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <Row className="mb-3">
                      <Col className="text-end">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          style={{ width: "100%" }}
                        >
                          Verify
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </div>
                }
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    Login
                  </Link>{" "}
                </p>
                
              </div>
            </Col>
          </Row>
        </Container>
        <ToastElement />
      </div>
    </React.Fragment>
  );
};


export default withRouter(ForgetPasswordPage);

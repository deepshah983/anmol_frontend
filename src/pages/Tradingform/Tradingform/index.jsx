import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar.png";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";

import { postData } from "../../components/api";
import { ToastElement, success, error } from "../../components/toast";

const UserProfile = (props) => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [name, setname] = useState("");
  const [id, setid] = useState(1);
  const [navigation, setNav] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (
        import.meta.env.VITE_APP_DEFAULTAUTH === "fake" ||
        import.meta.env.VITE_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setid(obj.id);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      user_name: name || "",
      user_id: id || "",
      old_password: (navigation && navigation.old_password) || "",
      new_password: (navigation && navigation.new_password) || "",
      confirm_password: (navigation && navigation.confirm_password) || "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Please Enter Your Username"),
      old_password: Yup.string().required("Please Enter Your Old Password"),
      new_password: Yup.string()
        .required("Please Enter Your New Password")
        .min(6, "Password must be at least 6 characters long"), // Adjust the minimum length as needed
      confirm_password: Yup.string()
        .required("Please Confirm Your New Password")
        .oneOf(
          [Yup.ref("new_password"), null],
          "New and Confirm Passwords must match"
        )
        .test(
          "not-same-as-old",
          "New password must not be the same as the old password",
          function (value) {
            const old_password = this.parent.old_password;
            return value !== old_password;
          }
        ),
    }),

    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  const handleUpdate = (values) => {
    postData("/authorization/change-password", values).then((res) => {
      if (res.data.error) {
        return error(res.data.message);
      }

      localStorage.setItem("authUser", JSON.stringify(res.data.data));
      return success(res.data.message);
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Anmol" titleUrl="/dashboard" breadcrumbItem="Profile" />

          <Form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Card>
              <CardBody>
                <div className="text-end">
                  <button type="submit" className="btn btn btn-primary">
                    Update
                  </button>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Change User Name & Password</h4>
                <div className="form-group mb-3">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="user_name"
                    // value={name}
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.user_name || ""}
                    invalid={
                      validation.touched.user_name &&
                        validation.errors.user_name
                        ? true
                        : false
                    }
                  />

                  {validation.touched.user_name &&
                    validation.errors.user_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.user_name}
                    </FormFeedback>
                  ) : null}
                  <Input name="user_id" value={id} type="hidden" />
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <Label className="form-label">Old Password</Label>
                      <Input
                        name="old_password"
                        // value={name}
                        className="form-control"
                        placeholder="Enter Old Password"
                        type="password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.old_password || ""}
                        invalid={
                          validation.touched.old_password &&
                            validation.errors.old_password
                            ? true
                            : false
                        }
                      />

                      {validation.touched.old_password &&
                        validation.errors.old_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.old_password}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <Label className="form-label">New Password</Label>
                      <Input
                        name="new_password"
                        // value={name}
                        className="form-control"
                        placeholder="Enter New Password"
                        type="password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.new_password || ""}
                        invalid={
                          validation.touched.new_password &&
                            validation.errors.new_password
                            ? true
                            : false
                        }
                      />

                      {validation.touched.new_password &&
                        validation.errors.new_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.new_password}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <Label className="form-label">Confirm Password</Label>
                      <Input
                        name="confirm_password"
                        // value={name}
                        className="form-control"
                        placeholder="Enter Confirm Password"
                        type="password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.confirm_password || ""}
                        invalid={
                          validation.touched.confirm_password &&
                            validation.errors.confirm_password
                            ? true
                            : false
                        }
                      />

                      {validation.touched.confirm_password &&
                        validation.errors.confirm_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.confirm_password}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
        </Container>
        <ToastElement />
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);

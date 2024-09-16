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

import withRouter from "../../../components/Common/withRouter";

import avatar from "../../../assets/images/users/avatar.png";
// actions
import { editProfile, resetProfileFlag } from "../../../store/actions";

import { postData } from "../../../components/api";
import { ToastElement, success, error } from "../../../components/toast";

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
      total_quantity: (navigation && navigation.total_quantity) || "",
      new_password: (navigation && navigation.new_password) || "",
      confirm_password: (navigation && navigation.confirm_password) || "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Please Enter Your Username"),
      total_quantity: Yup.string().required("This Field cannot be blank"),
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
            const total_quantity = this.parent.total_quantity;
            return value !== total_quantity;
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
        <Container fluid>

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
                <h4 className="card-title mb-4">Strategy</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group trading-form mb-3">
                      <Label className="form-label">Select Script</Label>
                      <select className="col-md-6 select-script" id="cars" name="cars">
                        <option value="" disabled selected>Select Script Name</option>
                        <option value="TATA POWER">TATA POWER</option>
                        <option value="BCG">BCG</option>
                        <option value="SIEMENS">SIEMENS</option>
                        <option value="LALPATHLAB">LALPATHLAB</option>
                        <option value="HINDCOPPER">HINDCOPPER</option>
                        <option value="M & M">M & M</option>
                        <option value="COCHIN SHIPYARD">COCHIN SHIPYARD</option>
                        <option value="RADHE DEVLOPERS">RADHE DEVLOPERS</option>
                      </select>
                      <Input name="user_id" value={id} type="hidden" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group trading-form mb-3">
                      <Label className="form-label">Select  Category</Label>
                      <select className="col-md-6 select-script" id="cars" name="cars">
                        <option value="" disabled selected>Select  Category(NSE/FO)</option>
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                      </select>
                      <Input name="user_id" value={id} type="hidden" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <Label className="form-label">Qty (Fixed/Exposure)</Label>
                      <Input
                        name="total_quantity"
                        // value={name}
                        className="form-control"
                        placeholder="Enter Quantity"
                        type="number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.total_quantity || ""}
                        invalid={
                          validation.touched.total_quantity &&
                            validation.errors.total_quantity
                            ? true
                            : false
                        }
                      />

                      {validation.touched.total_quantity &&
                        validation.errors.total_quantity ? (
                        <FormFeedback type="invalid">
                          {validation.errors.total_quantity}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group trading-form mb-3">
                      <Label className="form-label">Select  Category</Label>
                      <select className="col-md-6 select-script" id="cars" name="cars">
                        <option value="" disabled selected>Select  Category(NSE/FO)</option>
                        <option value="Intraday">Intraday</option>
                        <option value="Delivery">Delivery</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group  mb-3">
                    <Label className="form-label">Select Strategy</Label>
                    <div className="form-group trading-form mb-3">
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy1" />
                        Silver
                    </Label>
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy2" />
                        Gold
                    </Label>
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy3" />
                        Platinum
                    </Label>
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy4" />
                        Diamond
                    </Label>
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy5" />
                        Titanium
                    </Label>
                    <Label className="trading-form-checkbox">
                        <input type="checkbox" name="strategy6" />
                        Ruby
                    </Label>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group trading-form mb-3">
                      <Label className="form-label">Entry Order</Label>
                      <div className="form-group trading-form mb-3">
                        <input type="button" value="LIMIT" className="market-button"/>
                        <input type="button" value="MARKET" className="market-button"/>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
        </Container>
        <ToastElement />
      
    </React.Fragment>
  );
};

export default withRouter(UserProfile);

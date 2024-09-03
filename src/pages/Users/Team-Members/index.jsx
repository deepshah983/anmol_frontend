import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Input,
  FormFeedback,
  Label,
  Form,
  Button,
} from "reactstrap";

//Import Breadcrumb
import { postData } from "../../../components/api";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";
import thumb from "../../../assets/images/friends.svg";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../components/Common/TableContainer";

import { success, error } from "../../../components/toast";

// Column
import { Image, Name, Designation, Email } from "../../NavigationCol";
import HideShowSection from "../../../components/Common/HideShowSection";

const index = (props) => {
  const dispatch = useDispatch();
  const [navs, setNavs] = useState([]);
  const [count, setCount] = useState(0);
  const [addImagePrimary, setAddImagePrimary] = useState(thumb);
  useEffect(() => {
    getNavigation();
  }, []);

  const getNavigation = () => {
    postData("aboutus/getTeamMembers")
      .then((response) => {

        const myArray = response.data.data;
        const count = myArray.length;
        setNavs(response.data.data);
        setCount(count);
      });
  };
  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [navList, setNavList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [navigation, setNav] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      name: (navigation && navigation.name) || "",
      position: (navigation && navigation.position) || "",
      altText: (navigation && navigation.altText) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      position: Yup.string().required("Please Enter Designation"),
    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("createTeamMembers");
      let formData = new FormData();
      Object.keys(form).map((key) => {
        formData.append(key, form[key]);
      });
      if (isEdit) {
        formData.append("id", values.id);
        updateNavigation(formData);
      } else {

        addNewNavigation(formData);

      }
      validation.resetForm();
      setAddImagePrimary(thumb);
      toggle();
    },
  });

  const addNewNavigation = (form_data) => {


    postData("aboutus/createTeamMembers", form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      });
  };

  const updateNavigation = (form_data) => {

    postData("aboutus/editTeamMembers", form_data)
      .then((response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      });
  };
  const handleCustomerClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav.id,
      name: nav.name,
      position: nav.position,
      image: nav.image,
      altText: nav.altText
    });
    setAddImagePrimary(nav.image);
    setIsEdit(true);
    toggle();
  };

  const handleCheckingClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav.id,
      name: nav.name,
      position: nav.position,
      image: nav.image,
      altText: nav.altText
    });
    setAddImagePrimary(nav.image);
    setIsEdit(true);
    toggleCheck();
  };

  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "Checking",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCheckingClick(customerData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit  
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: true,
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "Mobile No.",
        accessor: "mobile_no.",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Entry Balance",
        accessor: "entry_balance",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Total Balance",
        accessor: "total_balance",
        filterable: true,
        Cell: (cellProps) => {
          return <Designation {...cellProps} />;
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCustomerClick(customerData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  
                }}
              >
                <i className="mdi mdi-form-select font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Select Script
                </UncontrolledTooltip>
                <div className="text-success-script">
                  <div>Assign Script</div>
                  <div>unassign Script</div>
                  <div>Assign License</div>
                  <div>Reset Password</div>
                  <div>Update Affiliate Commission</div>
                  <div>Update Pay Per Order Rate</div>
                </div>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  onClickDelete(customerData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  const toggle = () => {
    if (modal) {
      setModal(false);
      setNav(null);
    } else {
      setModal(true);
    }
  };

  const toggleCheck = () => {
    if (modalCheck) {
      setModalCheck(false);
      setNav(null);
    } else {
      setModalCheck(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (navigation) => {
    setNav(navigation);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    if (navigation && navigation.id) {

      let data = {
        id: navigation.id,
      };

      postData("aboutus/deleteTeamMembers", data)
        .then((response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);
          setNav("");
          setNavs(response.data.data);
          return success(response.data.message);
        });
    }
  };

  const handleCustomerClicks = () => {
    setNavList("");
    setAddImagePrimary(thumb);
    setIsEdit(false);
    toggle();
  };
  const handleCheckingClicks = () => {
    setNavList("");
    setAddImagePrimary(thumb);
    setIsEdit(false);
    toggleCheck();
  };
  const [form, setForm] = useState(null);
  const onChangeAddPrimary = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = () => {
      setAddImagePrimary(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setForm({ ...form, icon: e.target.files });
  };

  const handleDelPri = (e) => {
    e.preventDefault();
    document.getElementById("editCatImagePrimary").value = "";
    setAddImagePrimary(thumb);
  };



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Card>
        <CardBody>
          <TableContainer
            columns={columns}
            data={navs}
            cnt={count}
            isGlobalFilter={true}
            isAddCustList={true}
            isPagination={true}
            handleCustomerClick={handleCustomerClicks}
            handleCheckingClick={handleCheckingClicks}
            customPageSize={20}
            className="custom-header-css"
          />

          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Add User" : "Add User"}
            </ModalHeader>
            <ModalBody>
              <Form
                id="createTeamMembers"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label className="form-label">Name<small className="asterisk">*</small></Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Enter Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name && validation.errors.name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Email<small className="asterisk">*</small></Label>
                      <Input
                        name="Email"
                        type="Email"
                        placeholder="Enter Email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.Email || ""}
                        invalid={
                          validation.touched.Email && validation.errors.Email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.Email && validation.errors.Email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.Email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Mobile No.<small className="asterisk">*</small></Label>
                      <Input
                        name="Number"
                        type="Number"
                        placeholder="Enter Number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values?.Number || ""}
                        invalid={
                          validation.touched?.Number && validation.errors?.Number
                            ? true
                            : false
                        }
                      />
                      {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-customer"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>

          <Modal isOpen={modalCheck} toggle={toggleCheck}>
            <ModalHeader toggle={toggleCheck} tag="h4">
              {!!isEdit ? "My Tread Setting" : "My Tread Setting"}
            </ModalHeader>
            <ModalBody>
              <Form
                id="createTeamMembers"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Portel User ID<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control">
                        <option option value="" disabled selected>Select User ID</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 6</option>
                      </select>
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Portel Password<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control">
                      <option option value="" disabled selected>Select Password</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 6</option>
                      </select>
                      {validation.touched.Email && validation.errors.Email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.Email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">User Key<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control">
                        <option option value="" disabled selected>Select User Key</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 6</option>
                      </select>
                      {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3 form-controls">
                      <Label className="form-label">Appkey<small className="asterisk">*</small></Label>
                      <select name="name" id="" className="form-control"> 
                        <option option value="" disabled selected>Select Appkey</option>
                        <option value="name">name 1</option>
                        <option value="name">name 2</option>
                        <option value="name">name 3</option>
                        <option value="name">name 4</option>
                        <option value="name">name 5</option>
                        <option value="name">name 6</option>
                        <option value="name">name 6</option>
                      </select>
                      {validation.touched?.Number && validation.errors?.Number ? (
                        <FormFeedback type="invalid">
                          {validation.errors?.Number}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-customer"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>

        </CardBody>
      </Card>
    </React.Fragment>
  );
};


export default index;

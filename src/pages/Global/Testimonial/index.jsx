import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import { postData } from "../../../components/api";
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
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";
//redux
import TableContainer from "../../../components/Common/TableContainer";
import thumb from "../../../assets/images/thumb.png";
import { ToastElement, success, error } from "../../../components/toast";
// Column
import { Image, Description, Name, Role } from "../../NavigationCol";
import HideShowSection from "../../../components/Common/HideShowSection";

const index = (props) => {
  //meta title
  document.title = "Home | Anmol Admin & Dashboard Template";

  const [navs, setNavs] = useState([]);
  const [count, setCount] = useState(0);
  const [addImagePrimary, setAddImagePrimary] = useState(thumb);
  const [modal, setModal] = useState(false);
  const [navList, setNavList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [navigation, setNav] = useState(null);
  const [mainTitle, setMainTitle] = useState(null);
  const [titleId, setTitleId] = useState(null);

  useEffect(() => {
    getNavigation();
  }, []);

  const getNavigation = () => {
    postData("/global/getTestimonial").then((response) => {
      let resData = response.data.data.home_testimonial;
      if (response.data.error == false && resData.length) {
        setNavs(resData);
      }
      let settings = response.data.data.general_settings[0];
      if (settings && settings.tag == "home_testimonial") {
        let res = settings.response;
        res = JSON.parse(res);

        setTitleId(settings.id);
        setIsEditTitle(true);
        setMainTitle(res);
      }
    });
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      name: (navigation && navigation.name) || "",
      role: (navigation && navigation.role) || "",
      description: (navigation && navigation.description) || "",
      image: (navigation && navigation.image) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      role: Yup.string().required("Please Enter Role"),
      description: Yup.string().required("Please Enter Description"),
    }),
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("createNav");

      if (isEdit) {
        let formData = new FormData();
        Object.keys(form).map((key) => {
          if (key == "image") formData.append(key, form[key]);
        });
        formData.append("id", values.id);
        formData.append("name", values.name);
        formData.append("role", values.role);
        formData.append("description", values.description);

        updateNavigation(formData);
      } else {
        let formData = new FormData();
        Object.keys(form).map((key) => {
          formData.append(key, form[key]);
        });
        addNewNavigation(formData);
      }
      setAddImagePrimary(thumb);
      validation.resetForm();
      toggle();
    },
  });

  //validateTitle
  // validation
  const validationTitle = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (mainTitle && mainTitle.id) || "",
      title: (mainTitle && mainTitle.title) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Title"),
    }),
    onSubmit: (values) => {
      if (isEditTitle) {
        let response = {
          title: values.title,
        };
        let editTitle = {
          id: titleId,
          tag: "home_testimonial",
          response: response,
        };

        updateTitle(editTitle);
      } else {
        let response = {
          title: values["title"],
        };
        let addTitle = {
          tag: "home_testimonial",
          response: response,
        };
        addNewTitle(addTitle);
      }
      validationTitle.resetForm();
    },
  });

  const addNewNavigation = (form_data) => {

    postData("/global/createTestimonial", form_data).then(
      (response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      }
    );
  };

  const updateNavigation = (form_data) => {

    postData("/global/editTestimonial", form_data).then(
      (response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        setNavs(response.data.data);
        return success(response.data.message);
      }
    );
  };

  const addNewTitle = (form_data) => {
    postData("/generalsetting/createGeneralSetting", form_data).then(
      (response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        let generalData = response.data.data;
        generalData.forEach((element) => {
          if (element.tag == "home_testimonial") {
            let elementRes = JSON.parse(element.response);
            setMainTitle(elementRes);
            setIsEditTitle(true);

            setTitleId(element.id);
          }
        });
        return success(response.data.message);
      }
    );
  };

  const updateTitle = (form_data) => {
    postData("/generalsetting/editGeneralSetting", form_data).then(
      (response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        let generalData = response.data.data;
        generalData.forEach((element) => {
          if (element.tag == "home_testimonial") {
            let elementRes = JSON.parse(element.response);
            setMainTitle(elementRes);
            setIsEditTitle(true);

            setTitleId(element.id);
          }
        });

        return success(response.data.message);
      }
    );
  };
  const handleCustomerClick = (arg) => {
    const nav = arg;

    setNav({
      id: nav.id,
      name: nav.name,
      role: nav.role,
      description: nav.description,
      image: nav.image,
    });
    setAddImagePrimary(nav.image);
    setIsEdit(true);
    toggle();
  };

  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Image",
        accessor: "image",
        filterable: true,
        Cell: (cellProps) => {
          return <Image {...cellProps} />;
        },
      },
      {
        Header: "Role",
        accessor: "role",
        filterable: true,
        Cell: (cellProps) => {
          return <Role {...cellProps} />;
        },
      },
      {
        Header: "Description",
        accessor: "description",
        filterable: true,
        Cell: (cellProps) => {
          return <Description {...cellProps} />;
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

      postData("/global/deleteTestimonial", data).then(
        (response) => {
          if (response.data.error) {
            return error(response.data.message);
          }

          setDeleteModal(false);
          setNav("");
          setNavs(response.data.data);
          return success(response.data.message);
        }
      );
    }
  };

  useEffect(() => {
    setNavList(navs);
    setCount(count);
  }, [navs, count]);

  useEffect(() => {
    if (!isEmpty(navs)) {
      setNavList(navs);
      setCount(count);
    }
  }, [navs, count]);

  const handleCustomerClicks = () => {
    setNavList("");
    setIsEdit(false);
    setAddImagePrimary(thumb);
    toggle();
  };

  const [form, setForm] = useState(null);
  const onChangeAddPrimary = (e) => {
    const reader = new FileReader(),
      files = e.target.files;

    reader.onload = () => {
      setAddImagePrimary(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setForm({ ...form, image: e.target.files });
  };

  const handleDelPri = (e) => {
    e.preventDefault();

    document.getElementById("editCatImagePrimary").value = "";
    setAddImagePrimary(thumb);
  };



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Global" breadcrumbItem="Testimonial" />
          <Form
            id="testimonialTitle"
            onSubmit={(e) => {
              e.preventDefault();
              validationTitle.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col xs="12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <HideShowSection />
                      <button
                        type="submit"
                        className="btn btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <Card>
                  <CardBody>

                    <div className="section-title">
                      <label className="form-label form-label">Section Title</label>
                      <Input
                        className="form-control"
                        type="text"
                        name="title"
                        placeholder="Enter Section Title"
                        onChange={validationTitle.handleChange}
                        onBlur={validationTitle.handleBlur}
                        value={validationTitle.values.title || ""}
                        invalid={
                          validationTitle.touched.title &&
                            validationTitle.errors.title
                            ? true
                            : false
                        }
                      />
                      {validationTitle.touched.title &&
                        validationTitle.errors.title ? (
                        <FormFeedback type="invalid">
                          {validationTitle.errors.title}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col xs="12">
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
                    customPageSize={20}
                    className="custom-header-css"
                  />
                  <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit Testimonial" : "Add Testimonial"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        id="createNav"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col className="col-12">
                            <div className="mb-3">
                              <Label className="form-label">Name</Label>
                              <Input
                                name="name"
                                type="text"
                                placeholder="Enter Name"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                    validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                                validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <div className="col-md-12">
                                <div className="form-group d-flex">
                                  <div>
                                    <label className="d-block mt-1 mb-1">
                                      Image 
                                    </label>
                                    <img
                                      id="editCatImagePrimary"
                                      className="rounded me-50 imgBox"
                                      src={addImagePrimary}
                                      alt="Primary Logo"
                                    />
                                  </div>
                                  <div className="d-flex align-items-end mt-75 ms-1"></div>
                                </div>
                              </div>

                              <div className="col-md-12 mt-1">
                                <Button
                                  tag={Label}
                                  className="btn btn-primary btn-sm"
                                  size="sm"
                                  color="primary"
                                >
                                  Upload
                                  <input
                                    type="file"
                                    id="image_video"
                                    onChange={onChangeAddPrimary}
                                    name="image"
                                    accept="image/*"
                                    hidden
                                  />
                                </Button>
                                <button
                                  className="btn btn-danger btn-sm ms-1"
                                  onClick={handleDelPri}
                                >
                                  Reset
                                </button>
                              </div>
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Role</Label>
                              <Input
                                name="role"
                                type="text"
                                placeholder="EnterRole"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.role || ""}
                                invalid={
                                  validation.touched.role &&
                                    validation.errors.role
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.role &&
                                validation.errors.role ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.role}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Description</Label>

                              <textarea
                                name="description"
                                value={validation.values.description}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                className={`form-control ${validation.touched.description && validation.errors.description ? 'is-invalid' : ''
                                  }`}
                              ></textarea>
                              {validation.touched.description &&
                                validation.errors.description ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.description}
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
            </Col>
          </Row>
        </Container>
      </div>
      <ToastElement />
    </React.Fragment>
  );
};

export default index;

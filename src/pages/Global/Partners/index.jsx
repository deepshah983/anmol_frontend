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
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import themeConfig from "../../../configs/themeConfig";
import DeleteModal from "../../../components/Common/DeleteModal";
//redux
import TableContainer from "../../../components/Common/TableContainer";
import thumb from "../../../assets/images/thumb.png";
import { ToastElement, success, error } from "../../../components/toast";
// Column
import { Image, Order } from "../../NavigationCol";
import { postData } from "../../../components/api";
const index = (props) => {
  //meta title
  document.title = "Partners | Vishal Wealth Admin & Dashboard Template";

  const [navs, setNavs] = useState([]);
  const [count, setCount] = useState(0);
  const [addImagePrimary, setAddImagePrimary] = useState(thumb);
  useEffect(() => {
    getNavigation();
  }, []);

  const getNavigation = () => {
    postData("/global/getPartners").then((response) => {
      let resData = response.data.data.home_testimonial;
      let generalData = response.data.data.general_settings;
      if (response.data.error == false && resData.length) {
        setNavs(resData);
      }

      if (response.data.error == false && generalData.length) {
        let general = generalData[0].response;
        general = JSON.parse(general);

        setMainTitle(general);
        setIsEditTitle(true);
        setTitleId(generalData[0].id);
      }
    });
  };
  const [modal, setModal] = useState(false);
  const [navList, setNavList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [navigation, setNav] = useState(null);
  const [mainTitle, setMainTitle] = useState(null);
  const [titleId, setTitleId] = useState(null);
  const [isImageSet, setIsImageSet] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (navigation && navigation.id) || "",
      order: (navigation && navigation.order) || "",
      image: (navigation && navigation.image) || "",
    },
    onSubmit: (values) => {
      let form = themeConfig.functions.read_form("createNav");

      if (isEdit) {
        let formData = new FormData();
        Object.keys(form).map((key) => {
          if (key == "image") formData.append(key, form[key]);
        });
        formData.append("id", values.id);
        formData.append("order", values.order);

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
      main_title: (mainTitle && mainTitle.main_title) || "",
    },
    validationSchema: Yup.object({
      main_title: Yup.string().required("Please Enter Title"),
    }),
    onSubmit: (values) => {
      if (isEditTitle) {
        let response = {
          main_title: values.main_title,
        };
        let editTitle = {
          id: titleId,
          tag: "partners",
          response: response,
        };

        updateTitle(editTitle);
      } else {
        let response = {
          main_title: values["main_title"],
        };
        let addTitle = {
          tag: "partners",
          response: response,
        };
        addNewTitle(addTitle);
      }
      validationTitle.resetForm();
    },
  });

  const addNewNavigation = (form_data) => {
    postData("/global/createPartners", form_data).then((response) => {
      if (response.data.error) {
        return error(response.data.message);
      }
      setNavs(response.data.data);
      return success(response.data.message);
    });
  };

  const updateNavigation = (form_data) => {
    postData("/global/editPartners", form_data).then((response) => {
      if (response.data.error) {
        return error(response.data.message);
      }
      setNavs(response.data.data);
      return success(response.data.message);
    });
  };

  const addNewTitle = (form_data) => {
    postData("/generalsetting/createGeneralSetting", form_data).then(
      (response) => {
        if (response.data.error) {
          return error(response.data.message);
        }
        let generalData = response.data.data;
        generalData.forEach((element) => {
          if (element.tag == "partners") {
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
          if (element.tag == "partners") {
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
      order: nav.order,
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
        Header: "Order",
        accessor: "order",
        filterable: true,
        Cell: (cellProps) => {
          return <Order {...cellProps} />;
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

      postData("/global/deletePartners", data).then((response) => {
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
    setIsImageSet(1);
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
                <Card>
                  <CardBody>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn mb-2 me-2 btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                    <div className="section-title">
                      <h5 className="card-title mb-2">Section Title</h5>
                      <Input
                        className="form-control"
                        type="text"
                        name="main_title"
                        placeholder="Enter Section Title"
                        onChange={validationTitle.handleChange}
                        onBlur={validationTitle.handleBlur}
                        value={validationTitle.values.main_title || ""}
                        invalid={
                          validationTitle.touched.main_title &&
                            validationTitle.errors.main_title
                            ? true
                            : false
                        }
                      />
                      {validationTitle.touched.main_title &&
                        validationTitle.errors.main_title ? (
                        <FormFeedback type="invalid">
                          {validationTitle.errors.main_title}
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
                      {!!isEdit ? "Edit Item" : "Add Item"}
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
                              <Label className="form-label">Order</Label>
                              <Input
                                name="order"
                                type="number"
                                placeholder="EnterOrder"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.order || ""}
                              />
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

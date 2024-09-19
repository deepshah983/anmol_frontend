import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";
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

import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../../components/api";
import DeleteModal from "../../../components/Common/DeleteModal";
import TableContainer from "../../../components/Common/TableContainer";
import { success, error } from "../../../components/toast";
import HideShowSection from "../../../components/Common/HideShowSection";
import { Strategy } from "../../NavigationCol"; // Ensure this is correctly imported
import themeConfig from "../../../configs/themeConfig";

const StrategyManagement = () => {
  const [strategies, setStrategies] = useState([]);
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    getStrategies();
  }, []);

  const getStrategies = async () => {
    try {
      const response = await getData("/strategies");
      console.log(response.data.data);

      setStrategies(response.data.data);
      setCount(response.data.data.length);
    } catch (err) {
      error("Failed to load strategies");
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: strategy?.id || "",
      name: strategy?.name || "",
      maxOpenPos: strategy?.maxOpenPos || "",
      maxLongPos: strategy?.maxLongPos || "",
      maxShortPos: strategy?.maxShortPos || "",
      tradesPerDay: strategy?.tradesPerDay || "",
      ordersPerDay: strategy?.ordersPerDay || "",
      tradesPerScrip: strategy?.tradesPerScrip || "",
      quantityMultiplier: strategy?.quantityMultiplier || "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Strategy Name"),
      maxOpenPos: Yup.number().required("Please Enter Max Open Positions"),
      maxLongPos: Yup.number().required("Please Enter Max Long Positions"),
      maxShortPos: Yup.number().required("Please Enter Max Short Positions"),
      tradesPerDay: Yup.number().required("Please Enter Trades Per Day"),
      ordersPerDay: Yup.number().required("Please Enter Orders Per Day"),
      tradesPerScrip: Yup.number().required("Please Enter Trades Per Scrip"),
      quantityMultiplier: Yup.number().required(
        "Please Enter Quantity Multiplier"
      ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      
      // Append all values to the FormData object
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
    
      try {
        if (isEdit) {
          // Using template literals correctly
          await updateData(`/strategy/${values.id}`, formData);
        } else {
          await postData("/strategy", formData);
        }
    
        // Refresh the strategies after success
        getStrategies();
    
        // Show success message
        success(
          isEdit
            ? "Strategy Updated Successfully"
            : "Strategy Added Successfully"
        );
    
        // Toggle the form/modal (if any)
        toggle();
      } catch (err) {
        // Show error message in case of failure
        error("Failed to save strategy");
      }
    
      // Reset form validation after submission
      validation.resetForm();
    },
  });

  const handleStrategyClick = (strategyData) => {
    setStrategy({
      id: strategyData._id,
      name: strategyData.name,
      maxOpenPos: strategyData.maxOpenPos,
      maxLongPos: strategyData.maxLongPos,
      maxShortPos: strategyData.maxShortPos,
      tradesPerDay: strategyData.tradesPerDay,
      ordersPerDay: strategyData.ordersPerDay,
      tradesPerScrip: strategyData.tradesPerScrip,
      quantityMultiplier: strategyData.quantityMultiplier,
    });
    console.log(strategyData);

    setIsEdit(true);
    toggle();
  };

  const columns = useMemo(
    () => [
      {
        Header: "Strategy Name",
        accessor: "name",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Max Open Positions",
        accessor: "maxOpenPos",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Max Long Positions",
        accessor: "maxLongPos",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Max Short Positions",
        accessor: "maxShortPos",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Trades Per Day",
        accessor: "tradesPerDay",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Orders Per Day",
        accessor: "ordersPerDay",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Trades Per Scrip",
        accessor: "tradesPerScrip",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Quantity Multiplier",
        accessor: "quantityMultiplier",
        Cell: ({ value }) => <Strategy value={value} />,
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleStrategyClick(row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
              </UncontrolledTooltip>
            </Link>

            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(row.original)}
            >
              <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
              <UncontrolledTooltip placement="top" target="deletetooltip">
                Delete
              </UncontrolledTooltip>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const toggle = () => {
    if (modal) {
      setModal(false);
      setStrategy(null);
    } else {
      setModal(true);
    }
  };

  const onClickDelete = (strategy) => {
    setStrategy(strategy);
    setDeleteModal(true);
  };

  const handleDeleteStrategy = async () => {
    try {
      await deleteData(`/strategy/${strategy._id}`);
      success("Strategy Deleted Successfully");
      getStrategies();
    } catch (err) {
      error("Failed to delete strategy");
    }
    setDeleteModal(false);
  };

  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStrategy}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <HideShowSection
            title="Total Strategies"
            toggle={false}
            count={count}
          >
            <Button
              color="primary"
              className="btn btn-primary me-1 float-end"
              onClick={toggle}
            >
              + Add Strategy
            </Button>
          </HideShowSection>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={strategies}
                    isGlobalFilter={true}
                    isAddCustList={true}
                    isPagination={true}
                    handleCustomerClick={handleCustomerClicks}
                    customPageSize={20}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {isEdit ? "Edit Strategy" : "Add Strategy"}
        </ModalHeader>
        <ModalBody>
          <Form
            id="createStrategy"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <Row>
              <Col className="mb-3" md={12}>
                <Label htmlFor="name">Strategy Name</Label>
                <Input
                  name="name"
                  id="name"
                  placeholder="Strategy Name"
                  type="text"
                  value={validation.values.name}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.name && validation.errors.name}
                />
                <FormFeedback>{validation.errors.name}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="maxOpenPos">Max Open Positions</Label>
                <Input
                  name="maxOpenPos"
                  id="maxOpenPos"
                  placeholder="Max Open Positions"
                  type="number"
                  value={
                    isEdit && validation.values.maxOpenPos == 0
                      ? 0
                      : validation.values.maxOpenPos || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.maxOpenPos &&
                    validation.errors.maxOpenPos
                  }
                />
                <FormFeedback>{validation.errors.maxOpenPos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="maxLongPos">Max Long Positions</Label>
                <Input
                  name="maxLongPos"
                  id="maxLongPos"
                  placeholder="Max Long Positions"
                  type="number"
                  value={
                    isEdit && validation.values.maxLongPos == 0
                      ? 0
                      : validation.values.maxLongPos || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.maxLongPos &&
                    validation.errors.maxLongPos
                  }
                />
                <FormFeedback>{validation.errors.maxLongPos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="maxShortPos">Max Short Positions</Label>
                <Input
                  name="maxShortPos"
                  id="maxShortPos"
                  placeholder="Max Short Positions"
                  type="number"
                  value={
                    isEdit && validation.values.maxShortPos == 0
                      ? 0
                      : validation.values.maxShortPos || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.maxShortPos &&
                    validation.errors.maxShortPos
                  }
                />
                <FormFeedback>{validation.errors.maxShortPos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="tradesPerDay">Trades Per Day</Label>
                <Input
                  name="tradesPerDay"
                  id="tradesPerDay"
                  placeholder="Trades Per Day"
                  type="number"
                  value={
                    isEdit && validation.values.tradesPerDay == 0
                      ? 0
                      : validation.values.tradesPerDay || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.tradesPerDay &&
                    validation.errors.tradesPerDay
                  }
                />
                <FormFeedback>{validation.errors.tradesPerDay}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="ordersPerDay">Orders Per Day</Label>
                <Input
                  name="ordersPerDay"
                  id="ordersPerDay"
                  placeholder="Orders Per Day"
                  type="number"
                  value={
                    isEdit && validation.values.ordersPerDay == 0
                      ? 0
                      : validation.values.ordersPerDay || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.ordersPerDay &&
                    validation.errors.ordersPerDay
                  }
                />
                <FormFeedback>{validation.errors.ordersPerDay}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="tradesPerScrip">Trades Per Scrip</Label>
                <Input
                  name="tradesPerScrip"
                  id="tradesPerScrip"
                  placeholder="Trades Per Scrip"
                  type="number"
                  value={
                    isEdit && validation.values.tradesPerScrip == 0
                      ? 0
                      : validation.values.tradesPerScrip || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.tradesPerScrip &&
                    validation.errors.tradesPerScrip
                  }
                />
                <FormFeedback>{validation.errors.tradesPerScrip}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="quantityMultiplier">Quantity Multiplier</Label>
                <Input
                  name="quantityMultiplier"
                  id="quantityMultiplier"
                  placeholder="Quantity Multiplier"
                  type="number"
                  value={
                    isEdit && validation.values.quantityMultiplier == 0
                      ? 0
                      : validation.values.quantityMultiplier || ""
                  }
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.quantityMultiplier &&
                    validation.errors.quantityMultiplier
                  }
                />
                <FormFeedback>
                  {validation.errors.quantityMultiplier}
                </FormFeedback>
              </Col>

              <Col className="mb-3">
                <Button color="primary" type="submit">
                  {isEdit ? "Update" : "Submit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

StrategyManagement.propTypes = {
  history: PropTypes.object,
};

export default StrategyManagement;

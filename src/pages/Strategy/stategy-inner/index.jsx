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

      id: (strategy && strategy.id) || "",
      name: (strategy && strategy.name) || "",

      max_open_pos: strategy?.max_open_pos || "",
      max_long_pos: strategy?.max_long_pos || "",
      max_short_pos: strategy?.max_short_pos || "",
      trades_per_day: strategy?.trades_per_day || "",
      orders_per_day: strategy?.orders_per_day || "",
      trades_per_scrip: strategy?.trades_per_scrip || "",
      quantity_multiplier: strategy?.quantity_multiplier || "",
    },

    
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Strategy Name"),
      max_open_pos: Yup.number().required("Please Enter Max Open Positions"),
      max_long_pos: Yup.number().required("Please Enter Max Long Positions"),
      max_short_pos: Yup.number().required("Please Enter Max Short Positions"),
      trades_per_day: Yup.number().required("Please Enter Trades Per Day"),
      orders_per_day: Yup.number().required("Please Enter Orders Per Day"),
      trades_per_scrip: Yup.number().required("Please Enter Trades Per Scrip"),
      quantity_multiplier: Yup.number().required("Please Enter Quantity Multiplier"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));

      try {
        if (isEdit) {
          await updateData(`/strategies/${values.id}`, formData);
        } else {
          await postData("/strategies", formData);
        }
        getStrategies();
        success(isEdit ? "Strategy Updated Successfully" : "Strategy Added Successfully");
        toggle();
      } catch (err) {
        error("Failed to save strategy");
      }

      validation.resetForm();
    },
  });

  const handleStrategyClick = (strategyData) => {
    setStrategy({
      id: strategyData._id,
      name: strategyData.name,
      max_open_pos: strategyData.maxOpenPos,
      max_long_pos: strategyData.maxLongPos,
      max_short_pos: strategyData.maxShortPos,
      trades_per_day: strategyData.tradesPerDay,
      orders_per_day: strategyData.ordersPerDay,
      trades_per_scrip: strategyData.tradesPerScrip,
      quantity_multiplier: strategyData.quantityMultiplier,
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
      await deleteData(`/strategies/${strategy._id}`);
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
                <Label htmlFor="max_open_pos">Max Open Positions</Label>
                <Input
                  name="max_open_pos"
                  id="max_open_pos"
                  placeholder="Max Open Positions"
                  type="number"
                  value={isEdit && validation.values.max_open_pos == 0 ? 0 : validation.values.max_open_pos || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={
                    validation.touched.max_open_pos && validation.errors.max_open_pos
                  }
                />
                <FormFeedback>{validation.errors.max_open_pos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="max_long_pos">Max Long Positions</Label>
                <Input
                  name="max_long_pos"
                  id="max_long_pos"
                  placeholder="Max Long Positions"
                  type="number"
                  value={isEdit && validation.values.max_long_pos == 0 ? 0 : validation.values.max_long_pos || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.max_long_pos && validation.errors.max_long_pos}
                />
                <FormFeedback>{validation.errors.max_long_pos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="max_short_pos">Max Short Positions</Label>
                <Input
                  name="max_short_pos"
                  id="max_short_pos"
                  placeholder="Max Short Positions"
                  type="number"
                  value={isEdit && validation.values.max_short_pos == 0 ? 0 : validation.values.max_short_pos || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.max_short_pos && validation.errors.max_short_pos}
                />
                <FormFeedback>{validation.errors.max_short_pos}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="trades_per_day">Trades Per Day</Label>
                <Input
                  name="trades_per_day"
                  id="trades_per_day"
                  placeholder="Trades Per Day"
                  type="number"
                  value={isEdit && validation.values.trades_per_day == 0 ? 0 : validation.values.trades_per_day || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.trades_per_day && validation.errors.trades_per_day}
                />
                <FormFeedback>{validation.errors.trades_per_day}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="orders_per_day">Orders Per Day</Label>
                <Input
                  name="orders_per_day"
                  id="orders_per_day"
                  placeholder="Orders Per Day"
                  type="number"
                  value={isEdit && validation.values.orders_per_day == 0 ? 0 : validation.values.orders_per_day || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.orders_per_day && validation.errors.orders_per_day}
                />
                <FormFeedback>{validation.errors.orders_per_day}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="trades_per_scrip">Trades Per Scrip</Label>
                <Input
                  name="trades_per_scrip"
                  id="trades_per_scrip"
                  placeholder="Trades Per Scrip"
                  type="number"
                  value={isEdit && validation.values.trades_per_scrip == 0 ? 0 : validation.values.trades_per_scrip || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.trades_per_scrip && validation.errors.trades_per_scrip}
                />
                <FormFeedback>{validation.errors.trades_per_scrip}</FormFeedback>
              </Col>

              <Col className="mb-3" md={12}>
                <Label htmlFor="quantity_multiplier">Quantity Multiplier</Label>
                <Input
                  name="quantity_multiplier"
                  id="quantity_multiplier"
                  placeholder="Quantity Multiplier"
                  type="number"
                  value={isEdit && validation.values.quantity_multiplier == 0 ? 0 : validation.values.quantity_multiplier || ""}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  invalid={validation.touched.quantity_multiplier && validation.errors.quantity_multiplier}
                />
                <FormFeedback>{validation.errors.quantity_multiplier}</FormFeedback>
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

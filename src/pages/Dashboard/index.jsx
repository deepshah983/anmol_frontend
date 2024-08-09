import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
} from "reactstrap";
//import action
import { getChartsData as onGetChartsData } from "../../store/actions";
// Pages Components
import WelcomeComp from "./WelcomeComp";
import Totalcapital from "./Totalcapital";
import Activeusers from "./Activeusers";
import Inactiveusers from "./Inactiveusers";
//i18n
import { withTranslation } from "react-i18next";
//redux
import { useSelector, useDispatch } from "react-redux";

const Dashboard = props => {

  const reports = [
    { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
    { title: "Revenue", iconClass: "bx-archive-in", description: "$35, 723" },
    {
      title: "Average Price",
      iconClass: "bx-purchase-tag-alt",
      description: "$16.2",
    },
  ];


 

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetChartsData("yearly"));
  }, [dispatch]);

  //meta title
  document.title="Dashboard | Anmol Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xl="4">
              <WelcomeComp />
            </Col>
            <Col xl="4">
              <Activeusers />
            </Col>
            <Col xl="4">
              <Inactiveusers />
            </Col>
            <Col xl="4">
              <Totalcapital />
            </Col>
          </Row>
        </Container>
      </div>
     

    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);

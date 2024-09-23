// UserCard.jsx
import React from "react";
import { Card, Row, Col } from "reactstrap";

const DashboardCounts = ({ icon, title, number }) => (
  <Card className="overflow-hidden">
    <div className="bg-soft">
      <Row>
        <Col xs="9">
          <div className="text-primary p-3">
            <div className="logo-bg">
              <img src={icon} alt={title} height="35px" width="35px" />
            </div>
            <h5 className="text-primary m-0">{title}</h5>
          </div>
        </Col>
        <Col xs="3">
          <div className="text-primary total-numbers p-3">
            <h2 className="numbers">{number}</h2>
          </div>
        </Col>
      </Row>
    </div>
  </Card>
);

export default DashboardCounts;

// UserCard.jsx
import React from "react";
import { Card, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DashboardCounts = ({ icon, title, number, status, link }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const userStatus = ["active", "inactive"].includes(status) ? status : null;
    console.log("userStatus: ", userStatus);
    if (link) navigate(link, { state: { userStatus } });
  };

  return (
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
              {status !== null ? (
                <span onClick={handleNavigate}>
                  <h2 className="numbers">{number}</h2>
                </span>
              ) : (
                <h2 className="numbers">{number}</h2>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default DashboardCounts;

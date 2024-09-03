import React from "react"

import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar.png"
import profileImg from "../../assets/images/profile-img.png"
import totalCapital from "../../assets/images/money 1.svg"

const Activeusers = () => {
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-soft">
          <Row>
          <Col xs="7">
                <div className="text-primary p-3">
                  <div className="logo-bg">
                    <img src={totalCapital} alt="" height="35px" width="35px" />
                  </div>
                  <h5 className="text-primary m-0">Total Fund</h5>
                </div>
              </Col>
              <Col xs="5">
                <div className="text-primary total-numbers p-3">
                    <h2 className="numbers">86,85,22,445₹</h2>
                </div>
              </Col>
          </Row>
        </div>
        {/* <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">Henry Price</h5>
              <p className="text-muted mb-0 text-truncate">UI/UX Designer</p>
            </Col>
          </Row>
        </CardBody> */}
      </Card>
    </React.Fragment>
  )
}
export default Activeusers

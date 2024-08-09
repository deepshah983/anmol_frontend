import React from "react"

import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../assets/images/users/avatar.png"
import profileImg from "../../assets/images/profile-img.png"
import coinOne from "../../assets/images/coin 1.svg"

const Inactiveusers = () => {
  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
              <img src={coinOne} alt="" height="35px" width="35px" />
                <h5 className="text-primary m-0">Inactive Users </h5>
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
export default Inactiveusers

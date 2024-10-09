import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import DashboardCounts from "./DashboardCounts";
import GoldenTradingLoader from '../../components/Loader';
import totalCapital from "../../assets/images/money 1.svg";
import totalUsers from "../../assets/images/friends.svg";
import token from "../../assets/images/token.svg";
import activeUsers from "../../assets/images/ActiveUsers.svg";
import inactiveUsers from "../../assets/images/InactiveUsers.svg";

// i18n
import { withTranslation } from "react-i18next";
import { getData } from "../../components/api";

const Dashboard = (props) => {
  const [dashboardData, setDashboardData] = useState({});
  const [totalFundData, setTotalFundData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isTokenGenerated, setIsTokenGenerated] = useState(false); // Track token generation status

  useEffect(() => {
    fetchDashboardData(); // Fetch dashboard data when component mounts
    fetchTotalFund();
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Vishal Wealth Admin & Dashboard Template";
  }, []); // Ensure document title updates correctly

  // Function to fetch data from your backend API
  const fetchDashboardData = () => {
    getData("/dashboard/counts")
      .then((response) => {
        const countsData = response.data.data;
        setDashboardData(countsData); // Set the dashboard data
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching dashboard data", error);
        setLoading(false); // Set loading to false even if there is an error
      });
  };

  const fetchTotalFund = () => {
    getData("/dashboard/totalFund")
      .then((response) => {
        const countsData = response.data.data;
        setTotalFundData(countsData); // Set the dashboard data
      })
      .catch((error) => {
        console.error("Error fetching dashboard data", error);
        setLoading(false); // Set loading to false even if there is an error
      });
  };

  // Function to handle token generation
  const handleGenerateToken = () => {
    setIsTokenGenerated(true); // Set token as generated and button color changes to green
  };

  if (loading) {
    return <GoldenTradingLoader />;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="dashboard">
              <Row>
                <Col xl="12" className="generate-token-col mb-4">
                  <div xl="3" className="token-container d-flex flex-column align-items-center mt-3">
                    <button
                      className={`btn btn-lg ${isTokenGenerated ? 'bg-success' : 'btn-outline-danger'}`}
                      type="button"
                      onClick={handleGenerateToken} // Handle button click
                    >
                      <span className="btn-label mr-2">
                        <i className="fa fa-exclamation-circle"></i>
                      </span>
                      {isTokenGenerated ? 'Token Generated' : 'Generate Token'}
                    </button>
                    <h6 className="text-muted font-weight-normal mt-3 text-center" style={{ fontSize: "15px" }}>
                      {isTokenGenerated ? 'Token has been generated.' : 'Please generate a token to proceed.'}
                    </h6>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl="4">
                  <DashboardCounts
                    title="Total Users"
                    status="all"
                    number={dashboardData.clientCount || 0}
                    icon={totalUsers}
                    link={'/users'}
                  />
                </Col>
                <Col xl="4">
                  <DashboardCounts
                    title="Active Users"
                    status="active"
                    number={dashboardData.activeClientCount || 0}
                    icon={activeUsers}
                    link={'/users'}
                  />
                </Col>
                <Col xl="4">
                  <DashboardCounts
                    title="Inactive Users"
                    status="inactive"
                    number={dashboardData.inActiveClientCount || 0}
                    icon={inactiveUsers}
                    link={'/users'}
                  />
                </Col>
                <Col xl="4">
                  <DashboardCounts
                    title="Total Fund"
                    number={totalFundData.totalAvailableCash || 'Loading...'}
                    icon={totalCapital}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Dashboard);

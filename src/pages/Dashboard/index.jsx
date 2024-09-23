import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import DashboardCounts from "./DashboardCounts";
import coinOne from "../../assets/images/coin 1.svg";
import totalCapital from "../../assets/images/money 1.svg";
import totalUsers from "../../assets/images/friends.svg";
//i18n
import { withTranslation } from "react-i18next";
import { getData } from "../../components/api";


const Dashboard = (props) => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(); // Fetch dashboard data when component mounts
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Vishal Wealth Admin & Dashboard Template";
  }, []); // Ensure document title updates correctly

  // Function to fetch data from your backend API
  const fetchDashboardData = () => {
    getData("/dashboard/counts")
      .then((response) => {
        const countsData = response.data.data;
        console.log(countsData);
        setDashboardData(countsData); // Set the dashboard data
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching dashboard data", error);
        setLoading(false); // Set loading to false even if there is an error
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              <Col xl="4">
                <DashboardCounts
                  title="Total Users"
                  number={dashboardData.clientCount || 0}  
                  icon={totalUsers}
                />
              </Col>
              <Col xl="4">
                <DashboardCounts
                  title="Active Users"
                  number={dashboardData.activeClientCount || 0}  
                  icon={coinOne}
                />
              </Col>
              <Col xl="4">
                <DashboardCounts
                  title="Inactive Users"
                  number={dashboardData.inActiveClientCount || 0}  
                  icon={coinOne}
                />
              </Col>
              <Col xl="4">
                <DashboardCounts
                  title="Total Fund"
                  number={dashboardData.totalFund || 0}  
                  icon={totalCapital}
                />
              </Col>
            </Row>
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

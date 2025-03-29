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
import { CircularProgress } from '@material-ui/core';

// i18n
import { withTranslation } from "react-i18next";
import { getData } from "../../components/api";

const TOKEN_STORAGE_KEY = 'tokenGeneratedTime';
const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

const TotalFundDisplay = ({ totalFundData }) => {
  const displayValue = 
    totalFundData.totalAvailableCash !== undefined && totalFundData.totalAvailableCash !== null
      ? totalFundData.totalAvailableCash
      : <CircularProgress size={30} style={{ color: '#a7844c' }} />;

  return (
    <Col xl="4">
      <DashboardCounts
        title="Total Fund"
        number={displayValue}
        icon={totalCapital}
      />
    </Col>
  );
};

const Dashboard = (props) => {
  const [dashboardData, setDashboardData] = useState({});
  const [totalFundData, setTotalFundData] = useState({});
  const [loading, setLoading] = useState(true);
  const [tokenState, setTokenState] = useState('idle');
  const [buttonText, setButtonText] = useState('Generate Token');
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTotalFund();
    checkTokenStatus();
  }, []);

  useEffect(() => {
    document.title = "Dashboard | Vishal Wealth Admin & Dashboard Template";
  }, []);

  // Check token status and start timer if needed
  const checkTokenStatus = () => {
    const tokenTime = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (tokenTime) {
      const generatedTime = parseInt(tokenTime);
      const currentTime = Date.now();
      const timeDiff = currentTime - generatedTime;

      if (timeDiff < ONE_HOUR) {
        setTokenState('generated');
        setButtonText('Token Generated');
        startTimer(ONE_HOUR - timeDiff);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        resetTokenState();
      }
    }
  };

  const startTimer = (duration) => {
    setTimeRemaining(Math.floor(duration / 1000));
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          resetTokenState();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const resetTokenState = () => {
    setTokenState('idle');
    setButtonText('Generate Token');
    setTimeRemaining(null);
  };

  const formatTimeRemaining = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const fetchDashboardData = () => {
    getData("/dashboard/counts")
      .then((response) => {
        const countsData = response.data.data;
        setDashboardData(countsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      });
  };

  const fetchTotalFund = () => {
    getData("/dashboard/totalFund")
      .then((response) => {
        const countsData = response.data.data;
        setTotalFundData(countsData);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      });
  };

  const handleGenerateToken = () => {
    setTokenState('generating');
    setButtonText('Generating Token...');

    getData("/dashboard/generateToken")
      .then((response) => {
        setTokenState('generating');
        
        setTimeout(() => {
          setTokenState('generated');
          setButtonText('Token Generated');
          localStorage.setItem(TOKEN_STORAGE_KEY, Date.now().toString());
          startTimer(ONE_HOUR);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error generating token", error);
        resetTokenState();
      });
  };

  const getButtonClass = () => {
    switch (tokenState) {
      case 'generating':
        return 'btn-warning';
      case 'generated':
        return 'bg-success text-white';
      default:
        return 'btn-outline-danger';
    }
  };

  const getStatusText = () => {
    if (tokenState === 'generated' && timeRemaining) {
      return `Token will expire in ${formatTimeRemaining(timeRemaining)}`;
    }
    switch (tokenState) {
      case 'generating':
        return 'Token is being generated...';
      case 'generated':
        return 'Token has been generated.';
      default:
        return 'Please generate a token to proceed.';
    }
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
                  <div className="token-container d-flex flex-column align-items-center mt-3">
                    <button
                      className={`btn btn-lg ${getButtonClass()}`}
                      type="button"
                      onClick={handleGenerateToken}
                      disabled={tokenState === 'generating' || tokenState === 'generated'}
                    >
                      <span className="btn-label mr-2">
                        <i className="fa fa-exclamation-circle"></i>
                      </span>
                      {buttonText}
                    </button>
                    <h6 className="text-muted font-weight-normal mt-3 text-center" style={{ fontSize: "15px" }}>
                      {getStatusText()}
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
                <TotalFundDisplay totalFundData={totalFundData} />
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
import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Col, Layout, Row, Typography } from "antd";
import { displayErrorMessage } from "../../lib/utils";
import { HomeHero } from "./components";

import mapBackground from "./assets/map-background.jpg";
import imgSanFransisco from "./assets/san-fransisco.jpg";
import imgCancun from "./assets/cancun.jpg";

export const Home = (props: RouteComponentProps) => {

  const onSearch = (value: string) => {
    const { history } = props;
    const searchValue = value.trim();

    if (searchValue) {
      history.push(`/listings/${searchValue}`);
    }
    else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <Layout.Content className="home" style={{ backgroundImage: `url(${mapBackground})` }}>
      <HomeHero onSearch={onSearch}/>

      <div className="home__cta-section">
        <Typography.Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Typography.Title>
        <Typography.Paragraph>
          Helping you make the best decisions in renting your last minute locations.
        </Typography.Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in the United States
        </Link>
      </div>

      <div className="home__listings">
        <Typography.Title level={4} className="home__listings-title">
          Listings of any kind
        </Typography.Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={imgSanFransisco}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img src={imgCancun} alt="Cancún" className="home__listings-img" />
              </div>
            </Link>
          </Col>
        </Row>
      </div>

    </Layout.Content>
  );
};

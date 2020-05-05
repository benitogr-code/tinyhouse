import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Input, Row, Typography } from "antd";

import imgToronto from "../assets/toronto.jpg";
import imgDubai from "../assets/dubai.jpg";
import imgLosAngeles from "../assets/los-angeles.jpg";
import imgLondon from "../assets/london.jpg";

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = (props: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Typography.Title className="home-hero__title">Find a place you'll love to stay at</Typography.Title>
        <Input.Search
          placeholder="Search 'San Fransisco'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={props.onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/toronto">
            <Card cover={<img alt="toronto" src={imgToronto} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/dubai">
            <Card cover={<img alt="dubai" src={imgDubai} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/los%20angeles">
            <Card cover={<img alt="los-angeles" src={imgLosAngeles} />}>Los Angeles</Card>
          </Link>
        </Col>
        <Link to="/listings/london">
          <Col xs={0} md={6}>
            <Card cover={<img alt="london" src={imgLondon} />}>London</Card>
          </Col>
        </Link>
      </Row>
    </div>
  );
};

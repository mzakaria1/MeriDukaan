import React from "react";

import { Divider, Card } from "antd";
import MainLayout from "../common/Layout";
const { Meta } = Card;

export class Dashboard extends React.Component {
  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Dashboard</h4>
        <h6>This is dashboard page!</h6>
        <Divider />
        <div></div>
      </MainLayout>
    );
  }
}

export default Dashboard;

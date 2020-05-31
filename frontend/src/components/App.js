import React, { Component } from "react";
import { firebaseAuth } from "../config/firebase.config";
import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "../config/routes.config";

import { Spin } from "antd";

import "antd/dist/antd.css";

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  };
  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    return this.state.loading === true ? (
      <div style={{ textAlign: "center" }}>
        <Spin spinning={this.state.loading} tip="Loading Application..." />
      </div>
    ) : (
      <BrowserRouter>
        <MainRoutes authed={this.state.authed} />
      </BrowserRouter>
    );
  }
}

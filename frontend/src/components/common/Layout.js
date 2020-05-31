import React from "react";

import { Layout, Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { logout } from "../../helpers/auth";
import Navigation from "../common/Navigation";

const { Header, Content, Footer, Sider } = Layout;

export class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  onLogout = () => {
    logout();
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}>
          <div
            className="logo"
            style={{
              height: "32px",
              background: "rgba(255, 255, 255, 0.2)",
              margin: "16px",
            }}
          />
          <Navigation {...this.props} />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              background: "#fff",
              textAlign: "right",
              paddingRight: "10px",
            }}>
            <Button
              type="primary"
              icon={<PoweroffOutlined />}
              loading={this.state.iconLoading}
              onClick={this.onLogout}>
              Logout
            </Button>
          </Header>
          <Content style={{ margin: "20px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360, background: "#fff" }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Meri Dukaan ©2020 Created by M. Zakaria Nazir
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;

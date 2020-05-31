import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  ProfileOutlined,
  HddOutlined,
  ContainerOutlined,
  NotificationOutlined,
  SettingOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

const Navigation = (props) => {
  const pathname = props.location.pathname;
  return (
    <div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[pathname]}
        mode="inline"
        onClick={(e) => {
          if (e.key !== "logout") {
            props.history.push(e.key);
          }
        }}>
        <Menu.Item key="/">
          <HomeOutlined />
          <span>Dashboard</span>
        </Menu.Item>

        <Menu.Item key="/collections">
          <HddOutlined />
          <span>Collections</span>
        </Menu.Item>

        <Menu.Item key="/products">
          <HddOutlined />
          <span>Products</span>
        </Menu.Item>
        <Menu.Item key="/orders">
          <FileDoneOutlined />
          <span>Orders</span>
        </Menu.Item>

        <SubMenu
          key="/reports"
          title={
            <span>
              <ContainerOutlined />
              <span>Reports</span>
            </span>
          }>
          <Menu.Item key="3">Orders</Menu.Item>
          <Menu.Item key="4">Invoices</Menu.Item>
          <Menu.Item key="5">Payments</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <NotificationOutlined />
              <span>Notifications</span>
            </span>
          }>
          <Menu.Item key="6">Order</Menu.Item>
          <Menu.Item key="8">Confirmations</Menu.Item>
        </SubMenu>
        <Menu.Item key="/profile">
          <ProfileOutlined />
          <span>My Profile</span>
        </Menu.Item>
        <Menu.Item key="/sales">
          <SettingOutlined />
          <span>Sales</span>
        </Menu.Item>
        <Menu.Item key="/Settings">
          <SettingOutlined />
          <span>Settings</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navigation;

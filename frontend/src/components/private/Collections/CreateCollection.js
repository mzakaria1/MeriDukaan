import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Button, message, Spin, Divider, Table, Popconfirm } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

export class CreateCollection extends Component {
  render() {
    return (
      <MainLayout {...this.props}>
        <div
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            paddingRight: "10px",
          }}>
          <h3 style={{ float: "left", margin: "10px", marginLeft: 0 }}>
            Create New Collection Form
          </h3>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ float: "right", marginBottom: "10px" }}
            onClick={this.newCollectionForm}>
            Create Collection
          </Button> */}
        </div>
        <Divider />
      </MainLayout>
    );
  }
}

export default CreateCollection;

import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { message, Descriptions, Badge } from "antd";
// import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { database, storage } from "../../../config/firebase.config";

class ProductInfo extends Component {
  state = {
    p_details: null,
    loading_product: false,
  };

  loadData = () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    database
      .collection("Products")
      .doc(key[2])
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = [];
          data.push({
            ...doc.data(),
          });
          console.log(data);
          this.setState({
            loading_product: true,
            p_details: data[0],
          });
          console.log(this.state.p_details);
        } else {
          message.error("No such Product Exists.", 3.0);
          this.setState({
            loading_product: false,
          });
        }

        console.log(this.state.p_details.title);
      })
      .catch((error) => {
        message.error("Unable to fetch Product", 3.0, error.message);
        this.setState({ loading_product: false });
        console.log(error);
      });
  };
  componentDidMount() {
    this.loadData();
    console.log(this.state.p_details);
  }
  render() {
    return (
      <MainLayout {...this.props}>
        <Descriptions
          title="Product Info"
          bordered={true}
          layout="vertical"
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item key={1} label="Title">
            Cloud Database
          </Descriptions.Item>
          <Descriptions.Item key={2} label="Category">
            Prepaid
          </Descriptions.Item>
          <Descriptions.Item key={3} label="Type">
            18:00:00
          </Descriptions.Item>
          <Descriptions.Item key={4} label="Price">
            $80.00
          </Descriptions.Item>
          <Descriptions.Item key={5} label="Vendor">
            $20.00
          </Descriptions.Item>
          <Descriptions.Item key={6} label="Official">
            $60.00
          </Descriptions.Item>
          <Descriptions.Item key={7} label="Description">
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1
          </Descriptions.Item>
        </Descriptions>
      </MainLayout>
    );
  }
}

export default ProductInfo;

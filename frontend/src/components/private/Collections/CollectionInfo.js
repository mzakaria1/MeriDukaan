import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { message, Descriptions, Badge } from "antd";
import { database, storage } from "../../../config/firebase.config";

export class CollectionInfo extends Component {
  state = {
    c_details: null,
    c_loading: false,
  };

  componentDidMount() {
    console.log(this.props.info);
    // this.loadCollection();
  }

  loadCollection = () => {
    const path = this.props.history.location.pathname;
    const key = path.split("/");
    database
      .collection("Collections")
      .doc(key[2])
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = [];
          data.push({
            ...doc.data(),
          });
          console.log(data);
          this.setState(
            {
              c_details: data,
              c_loading: true,
            },
            () => {
              console.log(this.state.c_details);
            }
          );
        } else {
          message.error("No such Collection Exists.", 3.0);
          this.setState({
            c_details: null,
            c_loading: false,
          });
        }
      })
      .catch((error) => {
        message.error("Collection doesn't exist", 3.0);
        console.log(error);
        message.error(error);
        this.setState({
          c_details: null,
          c_loading: false,
        });
      });
  };

  render() {
    return (
      <MainLayout {...this.props}>
        <div>
          <Descriptions
            title="Collection Info"
            bordered={true}
            layout="vertical"
            key={0}
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item key={1} label="Product">
              Cloud Database
            </Descriptions.Item>
            <Descriptions.Item key={2} label="Billing">
              Prepaid
            </Descriptions.Item>
            <Descriptions.Item key={3} label="time">
              18:00:00
            </Descriptions.Item>
            <Descriptions.Item key={4} label="Amount">
              $80.00
            </Descriptions.Item>
            <Descriptions.Item key={5} label="Discount">
              $20.00
            </Descriptions.Item>
            <Descriptions.Item key={6} label="Official">
              $60.00
            </Descriptions.Item>
            <Descriptions.Item key={7} label="Config Info" span={3}>
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
        </div>
      </MainLayout>
    );
  }
}

export default CollectionInfo;

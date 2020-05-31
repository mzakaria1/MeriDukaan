import React, { Component } from "react";
import MainLayout from "../../common/Layout";
import { Button, message, Spin, Divider, Table, Popconfirm } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import CollectionInfo from "./CollectionInfo";

import { database } from "../../../config/firebase.config";
export class AllCollections extends Component {
  state = {
    loading: true,
    collections: null,
  };

  columns = [
    {
      title: " Images",
      dataIndex: "imagesurls",
      key: "imagesurls",
      render: (url) => (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/practice-aa.appspot.com/o/product_images%2FQmEHNVwca5XwlBC6io8l%2Fss.jpg?alt=media&token=da8ddf9d-4cbb-4585-9c1c-146d142f8621"
          alt="Uploaded Images"
          height="100"
          width="150"
        />
      ),
    },
    {
      title: "Collection Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => this.collectionInfo(record)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Products",
      dataIndex: "inProducts",
      key: "vendor",
    },
    {
      title: "Starting Price",
      dataIndex: "starting_price",
      key: "starting_price",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            block
            style={{
              backgroundColor: "green",
            }}
            onClick="">
            Edit
          </Button>

          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm=""
            okText="Yes"
            cancelText="No">
            <Button block type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.loadCollections();
  }

  // componentDidUpdate(prevState, nextProps) {
  //   if (prevState !== nextProps) {
  //     this.loadCollections();
  //   }
  // }

  async loadCollections() {
    let pros = "";
    const data = [];
    await database
      .collection("Collections")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const pro = doc.data().products;
          if (!pro.isNullofEmpty) {
            this.load(pro)
              .then((pp) => {
                data.push({
                  id: doc.id,
                  inProducts: pp,
                  ...doc.data(),
                });
                console.log(data);
                this.setState(
                  {
                    collections: data,
                    loading: false,
                  },
                  () => {
                    console.log(this.state.collections);
                  }
                );
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            data.push({
              id: doc.id,
              ...doc.data(),
            });
            console.log("No");
            this.setState(
              {
                collections: data,
                loading: false,
              },
              () => {
                console.log(this.state.collections);
              }
            );
          }
        });
      })
      .catch((error) => {
        message.error("Unable to Fetch Collections", error.message);
        console.log(error);
      });
  }

  load = (c_productIds) => {
    return new Promise((resolve, reject) => {
      let pros = "";
      c_productIds.forEach((element) => {
        database
          .collection("Products")
          .doc(element)
          .get()
          .then((e) => {
            const pp = " || " + e.data().title;
            console.log(e.data());
            console.log(pp);
            pros = pp + pros;
            console.log(pros);
            resolve(pros);
          })
          .catch((error) => {
            console.log(error);
            reject(pros);
          });
      });
      console.log(pros);
    });
  };

  getAllDoc() {}

  collectionInfo = (record) => {
    this.props.history.push("collectionInfo/" + record.id);
  };

  newCollectionForm = () => {
    this.props.history.push("/newCollectionForm");
  };

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
            All Collections
          </h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ float: "right", marginBottom: "10px" }}
            onClick={this.newCollectionForm}>
            Create Collection
          </Button>
        </div>
        <Divider />
        {this.state.loading && !this.state.collections ? (
          <Spin spinning={true} tip="Loading products..." />
        ) : (
          <Table
            columns={this.columns}
            dataSource={this.state.collections}
            rowKey="id"
          />
        )}
      </MainLayout>
    );
  }
}

export default AllCollections;

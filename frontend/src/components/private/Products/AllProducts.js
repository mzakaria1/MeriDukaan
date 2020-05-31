import React from "react";
import MainLayout from "../../common/Layout";
import { Button, message, Spin, Divider, Table, Popconfirm } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { database } from "../../../config/firebase.config";
import { storage } from "firebase";

class AllProducts extends React.Component {
  state = {
    products: null,
    loading: true,
    deletingProduct: false,
    deleteId: null,
    data: null,
  };
  onChange = (a, b, c) => {
    console.log(a, b, c);
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
      title: "Product Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() => {
            this.productInfo(record.id);
          }}>
          {text}
        </a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "type",
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
            onClick={() => this.editProductForm(record.id)}>
            Edit
          </Button>

          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => this.deleteProduct(record.id)}
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

  deleteProduct = (id) => {
    if (
      (this.state.loading && !this.state.products) ||
      this.state.deletingProduct === true
    ) {
      this.render(<Spin spinning={true} tip="Loading products..." />);
    } else {
      this.setState({
        deleteingProduct: true,
        deleteId: id,
      });
      database
        .collection("Products")
        .doc(id)
        .delete()
        .then((snapshot) => {
          message
            .loading("Deleting Product", 2.0, () => this.loadProducts())
            .then(() => {
              message.success(
                "Product has been deleted successfully!",
                1.5,
                () => {
                  this.setState({
                    deleteingProduct: false,
                    deleteId: null,
                  });
                }
              );
            })
            .then(() => message.info("Product table has been updated", 0.5));
        })
        .catch((error) => {
          console.error("Error Deleting document: ", error);
          message.error("Error while deleting product", error);
        });
    }
  };
  productInfo = (selected_product) => {
    this.props.history.push("/productInfo/" + selected_product);
  };

  editProductForm = (id) => {
    this.props.history.push("/editProduct/" + id);
  };
  addNewProduct = () => {
    this.props.history.push("/addNewProduct");
  };

  loadProducts = () => {
    database
      .collection("Products")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        this.setState({
          products: data,
          loading: false,
        });
        console.log(data);
      })
      .catch((err) => {
        message.error("Unable to Fetch Products", 3.0);
      });
  };

  componentDidMount() {
    // storage.ref().child('product_images/43011538_2404850732881692_8716120052551647232_n.jpg').getDownloadURL().then(function(url) {
    //   // Get the download URL for 'images/stars.jpg'
    //   // This can be inserted into an <img> tag
    //   // This can also be downloaded directly
    // }).catch(function(error) {
    //   // Handle any errors
    // });
    //this.loadProducts();
    this.loadFromServer();
    console.log(this.state.data);
  }

  loadFromServer = () => {
    fetch("http://localhost:4000/users/p", {
      method: "get",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(response =>
        response.json()
      )
      .then(response => {
        console.log(response);
      });
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
            All Products{" "}
            {this.state.data === null ? "rr" : alert(this.state.data)}
          </h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ float: "right", marginBottom: "10px" }}
            onClick={this.addNewProduct}>
            Add New Product
          </Button>
        </div>
        <Divider />
        {this.state.loading && !this.state.products ? (
          <Spin spinning={true} tip="Loading products..." />
        ) : (
            <Table
              columns={this.columns}
              dataSource={this.state.products}
              rowKey="id"
            />
          )}
      </MainLayout>
    );
  }
}

export default AllProducts;

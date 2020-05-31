import React from "react";
import MainLayout from "../../common/Layout";
import { Form, Input, Button, Divider, message, Spin } from "antd";
import { database } from "../../../config/firebase.config";

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a validate email!",
    number: "Not a validate number!"
  },
  number: {
    range: "Must be between ${min} and ${max}"
  }
};
export class EditProduct extends React.Component {
  state = {
    product: null,
    gettingProducts: false,
    id: null
  };
  onFinish = values => {
    database
      .collection("Products")
      .doc(this.state.id)
      .update({
        title: values.title,
        description: values.Description,
        vendor: values.Vendor,
        Category: values.Category,
        Type: values.Type,
        price: values.price
      })
      .then(res => {
        this.props.history.push("/products");
        message.success("Product has been Edited Successfully!");
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        message.error("Error while editing product", error);
      });
  };
  cancelUpdate = () => {
    window.history.back();
  };
  loadDataForEdit = () => {
    const dd = this.props.history.location.pathname;
    const key = dd.split("/");
    database
      .collection("Products")
      .doc(key[2])
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({
            product: doc.data(),
            gettingProducts: true,
            id: key[2]
          });
        }
      });
  };

  componentDidMount() {
    this.loadDataForEdit();
  }
  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Eidt Product</h4>
        <Divider />
        {this.state.product ? (
          <Form
            {...layout}
            name="nest-messages"
            onFinish={this.onFinish}
            validateMessages={validateMessages}
            initialValues={{
              title: this.state.product.title,
              Description: this.state.product.description,
              Type: this.state.product.Type,
              Category: this.state.product.Category,
              Vendor: this.state.product.vendor,
              price: this.state.product.price
            }}>
            <Form.Item
              name="title"
              label="Product Title"
              rules={[
                {
                  required: true
                }
              ]}>
              <Input />
            </Form.Item>
            <Form.Item name="Description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="Type" label="Type">
              <Input />
            </Form.Item>
            <Form.Item name="Category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item name="Vendor" label="Vendor">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="price">
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="danger" onClick={this.cancelUpdate}>
                CANCEL
              </Button>
              <Divider type="vertical" />
              <Button type="primary" htmlType="submit">
                UPDATE
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Spin spinning tip="Loadin gProduct..." />
        )}
      </MainLayout>
    );
  }
}

export default EditProduct;

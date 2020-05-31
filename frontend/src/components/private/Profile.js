import React from "react";

import { Divider, Input, Form, message, Spin, Descriptions } from "antd";
import MainLayout from "../common/Layout";

import { UserOutlined } from "@ant-design/icons";

import { firebaseAuth, database } from "../../config/firebase.config";

export class Profile extends React.Component {
  state = {
    user: null,
    loading: true,
  };

  componentDidMount() {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        database
          .collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();
            this.setState({
              user: {
                email: user.email,
                uid: user.uid,
                ...data,
              },
              loading: false,
            });
          })
          .catch((err) => {
            message.error(err.message);
          });
      } else {
        message.error(
          "There was some error fetching users data. Try reloading page!"
        );
      }
    });
  }

  render() {
    return (
      <MainLayout {...this.props}>
        <h4>My Profile</h4>
        <p>User profile details...</p>
        <Divider />
        <Spin spinning={this.state.loading} tip={"Loading User Profile..."}>
          {this.state.user ? (
            <Form
              name="normal_login"
              className="login-form"
              onFinish={this.onFinish}
              initialValues={{ email: this.state.user.email }}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  disabled
                />
              </Form.Item>
            </Form>
          ) : null}
        </Spin>
        {this.state.user ? (
          <Descriptions>
            <Descriptions.Item label="Name" key="name">
              {this.state.user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Location" key="Location">
              {this.state.user.location}
            </Descriptions.Item>
            <Descriptions.Item label="Address" key="address">
              {this.state.user.address}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </MainLayout>
    );
  }
}

export default Profile;

import React, { Component } from "react";
import { Layout, Form, Button, Input, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { auth } from "../../helpers/auth";
import { database } from "../../config/firebase.config";

const { Content } = Layout;

export class Signup extends Component {
  state = {
    signingUp: false
  };

  onFinish = values => {
    console.log("Received values of form: ", values);
    const { email, password, name } = values;
    this.setState({
      signingUp: true
    });
    auth(email, password)
      .then(res => {
        console.log(res);
        const userDoc = {
          name: name,
          role: "Supplier"
        };
        database
          .collection("users")
          .doc(res.user.uid)
          .set(userDoc)
          .then(response => {
            message.success("New Account Created Successfully!", 1.5, () => {
              this.props.history.push("/");
            });
          })
          .catch(err => message.error(err.message));
      })
      .catch(error => {
        console.log(error);
        this.setState({
          signingUp: false
        });
        message.error(error.message);
      });
  };
  render() {
    return (
      <div>
        <Layout className="layout">
          <Content style={{ padding: "50px" }}>
            <Row>
              <Col span={12} offset={6}>
                <div style={{ textAlign: "center" }}>
                  <h3>Signup</h3>
                </div>

                <Form
                  name="normal_login"
                  className="login-form"
                  onFinish={this.onFinish}>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Username!"
                      },
                      {
                        type: "email",
                        message: "The input is not valid E-mail!"
                      }
                    ]}>
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please input your Password!" }
                    ]}>
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Please input your Name!" }
                    ]}>
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="text"
                      placeholder="Name"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={this.state.signingUp}>
                      Create New Account
                    </Button>{" "}
                    Or Already have an account?{" "}
                    <Link to="/login">Login Now!</Link>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Signup;

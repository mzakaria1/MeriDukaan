import React, { Component } from "react";
import { Layout, Form, Button, Input, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { login, logout } from "../../helpers/auth";
import { database } from "../../config/firebase.config";

const { Content } = Layout;

export class Login extends Component {
  state = {
    loggingIn: false
  };

  onFinish = values => {
    console.log("Received values of form: ", values);
    const { email, password } = values;
    this.setState({
      loggingIn: true
    });

    login(email, password)
      .then(res => {
        console.log(res);
        const uid = res.user.uid;
        database
          .collection("users")
          .doc(uid)
          .get()
          .then(snapshot => {
            const user = snapshot.data();
            if (user.role === "Supplier") {
              this.props.history.push("/");
            } else {
              message.error("Invalid Supplier Account!");
              logout();
            }
          });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loggingIn: false
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
                  <h3>Login</h3>
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
                  <Form.Item>
                    <Link to="/reset-password">Forgot password</Link>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={this.state.loggingIn}>
                      Log in
                    </Button>
                    Or <Link to="/signup">Register Now!</Link>
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

export default Login;

import React from "react";
import MainLayout from "../../common/Layout";
import {
  Form,
  Input,
  Button,
  Divider,
  message,
  Select,
  InputNumber,
  Spin,
  Upload,
  Modal,
  Tabs,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  database,
  firebaseAuth,
  storage,
} from "../../../config/firebase.config";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "This field is required!",
  types: {
    email: "Not a validate email!",
    number: "Not a validate number!",
  },
};

export class AddNewProduct extends React.Component {
  state = {
    product_categories: null,
    loading_categories: false,
    category_types: null,
    type: null,
    category_names: null,
    vendorName: null,
    previewVisible: false,
    loggedInUserID: null,
    previewImage: "",
    fileList: [],
    tabKey: "1",
    newTabIndex: 0,
    panes: [
      {
        title: "Tab 3",
        key: "3",
      },
    ],
    activeKey: "1",
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
    console.log(file);
  };

  handleChange = ({ fileList }) => {
    if (fileList.size > 5024) {
      console.log("sahi hsai");
    } else {
      this.setState({ fileList });
      console.log(fileList);
    }
  };

  handleUploadPics = () => {
    console.log(this.state.fileList);
    const files = this.state.fileList;
    files.forEach((ee) => {
      if (ee.type === "image/jpeg" || ee.type === "image/png") {
        console.log(ee.name + " should be JPG or PNG type");
      } else {
        message.warning("Only Jpg file supported! ", 2.0);
      }
    });

    // const images = this.state.pics;
    // const uploadTask = storage.ref("product_images/${images.name}").put(images);
    // uploadTask.on(
    //   "state_changed",
    //   snapshot => {
    //     // Progress function
    //   },
    //   error => {
    //     console.log(error);
    //   },
    //   complete => {
    //     //COmplete function
    //     storage
    //       .ref("product_images")
    //       .child(images.name)
    //       .getDownloadURL()
    //       .then(url => {
    //         console.log(url);
    //       });
    //   }
    // );
  };
  handleCategoryChange = (value) => {
    const ee = this.state.product_categories;
    for (let index = 0; index < ee.length; index++) {
      const element = ee[index].category_name;
      if (element === value) {
        this.setState({
          category_types: ee[index].category_type,
          name: value,
          loadCategories: true,
          type: ee[index].category_type[0],
        });
      }
    }
    console.log(this.state.category_types);
  };

  onTypeChange = (value) => {
    this.setState({
      type: value,
    });
  };

  loadCategories = () => {
    database
      .collection("Categories")
      .get()
      .then((snapshot) => {
        const names = [];
        const categories = [];
        snapshot.docs.forEach((element) => {
          categories.push({
            id: element.id,
            ...element.data(),
          });
          names.push(element.data().category_name);
        });
        this.setState({
          product_categories: categories,
          loading_categories: true,
          name: names[0],
          category_names: names,
        });
        console.log(this.state.product_categories);
        console.log(this.state.name);
        console.log(this.state.category_names);
      })
      .catch((error) => {
        message.error("Failed to load Categories", 1.5, error.message);
        console.log(error);
      });
  };

  componentDidMount = () => {
    console.log(this.state.activeKey);
    console.log(this.state.fileList);
    //const { previewVisible, previewImage, fileList } = this.state;
    //this.setState({ activeKey: this.state.panes[0].key });
    this.newTabIndex = 0;
    this.loadCategories();
    firebaseAuth().onAuthStateChanged((user) => {
      console.log(user.uid);
      this.setState({ loggedInUserID: user.uid });
      if (user) {
        database
          .collection("users")
          .doc(user.uid)
          .get()
          .then(
            (snapshot) => {
              const data = snapshot.data();
              console.log(data.name);
              this.setState({
                vendorName: data.name,
              });
            },
            () => {
              console.log(this.state.vendorName);
            }
          )
          .catch((err) => {
            message.error(err.message);
          });
      } else {
        message.error(
          "There was some error fetching users data. Try reloading page!"
        );
      }
    });
  };
  cancelAddProduct = () => {
    window.history.back();
  };

  onFinish = (values) => {
    console.log(values);
    const files = this.state.fileList;
    console.log("Files: ", files);
    if (files.length < 1) {
      message.error("Please Select An Image First!");
      return;
    } else {
      database
        .collection("Products")
        .add({
          title: values.title,
          description: values.Description,
          vendor: this.state.vendorName,
          Category: values.Category,
          Type: values.Type,
          price: values.price,
        })
        .then(async (snapshot) => {
          const id = snapshot.id;
          const fileurls = [];

          files.forEach(async (file) => {
            const fileobj = file.originFileObj;
            const imagepath = `product_images/${id}/${file.name}`;
            fileurls.push(imagepath);
            await storage.ref(imagepath).put(fileobj);
            // .then(res => {
            //   console.log(res);
            // });
            // if (fileRes) fileurls.push(fileRes.metadata.fullPath);
          });
          console.log(fileurls);
          snapshot
            .set({
              imagesUrls: fileurls,
              title: values.title,
              description: values.Description,
              vendor: this.state.vendorName,
              Category: values.Category,
              Type: values.Type,
              price: values.price,
              userId: this.state.loggedInUserID,
            })
            .then((updateRes) => {
              console.log(updateRes);
              message.success("New Product has been Added Successfully!", 2.5);
            })
            .catch((err) => {
              message.error(err.message, 2.5);
            });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          message.error("Error while adding New Product", error.message);
        });
    }
  };

  nextTab = () => {
    this.setState({ tabKey: "2" });
  };

  handleTabKey = (key) => {
    this.setState({ tabKey: key });
  };

  onChange = (activeKey) => {
    this.setState({ activeKey }, () => {
      console.log(activeKey);
    });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({
      title: "Add New Product",
      key: activeKey,
    });
    this.setState({ panes: panes, activeKey }, () => {
      console.log(this.state.activeKey);
    });
  };

  remove = (targetKey) => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter((pane) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey: activeKey });
  };

  newProductTab = () => {
    {
      /* //************************ //Adding New Products Tab\\***********************/
    }
    const { previewVisible, previewImage, fileList } = this.state;
    return (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        name="new-products"
        onFinish={this.onFinish}
        validateMessages={validateMessages}>
        <Form.Item
          name="title"
          label="Product Title"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item name="Description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="Category"
          label="Category"
          rules={[
            {
              required: true,
            },
          ]}>
          {this.state.category_names === null ? (
            <Spin spinning={true} tip="Loading Categories..." />
          ) : (
            <Select
              placeholder="Please Select Category"
              defaultValue={"Please Select Category"}
              onChange={this.handleCategoryChange}
              style={{ width: "100%" }}>
              {this.state.category_names.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="Type"
          label="Type"
          rules={[
            {
              required: true,
            },
          ]}>
          {this.state.category_types === null || this.state.type === null ? (
            <Select
              placeholder="Please Select Category First"
              style={{ width: "100%" }}>
              <Select.Option className="Option">
                Please Select Category First
              </Select.Option>
            </Select>
          ) : (
            <Select
              placeholder="Please Select Type"
              value={this.state.type}
              onChange={this.onTypeChange}
              style={{ width: "100%" }}>
              {this.state.category_types.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Vendor">
          {this.state.vendorName === null ? (
            <Spin spinning={true} tip="Loading Vendor..." />
          ) : (
            <Input defaultValue={this.state.vendorName} disabled />
          )}
        </Form.Item>
        <Form.Item
          name="price"
          label="price"
          rules={[
            {
              type: "number",
            },
          ]}>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Images"
          name="images"
          rules={[
            {
              required: true,
              message: "Please Upload min 1 Picture",
            },
          ]}>
          <div className="clearfix">
            <Upload
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              customRequest={this.dummyRequest}
              beforeUpload={this.beforeUpload}
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
              accept="image/*">
              {fileList.length >= 4 ? null : this.uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}>
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
            {/* <Button type="primary" onClick={this.handleUploadPics}>
      Upload
    </Button> */}
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>
          <Button type="danger" onClick={this.cancelAddProduct}>
            Cancel
          </Button>
          <Divider type="vertical" />
          <Button type="primary" htmlType="submit">
            ADD
          </Button>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { TabPane } = Tabs;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Choose File</div>
      </div>
    );
    return (
      <MainLayout {...this.props}>
        <h4>Add A new Product</h4>
        <Divider />

        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          defaultActiveKey="1">
          <TabPane tab="Add Collection" key="1" closable={false}>
            <Form
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              layout="horizontal"
              name="collections"
              onFinish={this.nextTab}
              validateMessages={validateMessages}>
              <Form.Item
                name="collection_title"
                label="Collection Name"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="collection_des"
                label="Collection Description"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="starting_price"
                label="Price Starting-From"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <InputNumber />
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 5 }}>
                <Button type="danger" onClick={this.cancelAddProduct}>
                  Cancel
                </Button>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "green" }}>
                  Next
                </Button>
                <Divider type="vertical" />
              </Form.Item>
            </Form>
          </TabPane>

          {/* //*************1111*********** //Adding New Products Tab\\***********************/}
          <TabPane tab="Add a Product" key="2" closable={false}>
            {this.newProductTab()}
          </TabPane>

          {this.state.panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {this.newProductTab()}
            </TabPane>
          ))}
        </Tabs>
      </MainLayout>
    );
  }
}

export default AddNewProduct;

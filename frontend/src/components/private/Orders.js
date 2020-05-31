import React, { Component } from "react";
import MainLayout from "../common/Layout";
import { Table, Divider, Tag } from "antd";

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    render: text => <a>{text}</a>
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName"
  },
  {
    title: "Description",
    dataIndex: "des",
    key: "des"
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity"
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size"
  },
  {
    title: "Customer Name",
    dataIndex: "cusName",
    key: "cusName"
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "Phone No",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city"
  },
  {
    title: "Payment Method",
    dataIndex: "payMethod",
    key: "payMethod"
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (
      status // Non-Approved, Approved, Dis-Approved, Pending, Delievered, Returned, Completed
    ) => (
      <span>
        {status.map(tag => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    )
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <a>Invite {record.cusName}</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    )
  }
];

const data = [
  {
    key: "1",
    orderId: 11,
    productId: 32,
    productName: "Bike",
    des: "Red color bike with petrol",
    quantity: 1,
    size: "CD-70",
    cusName: "Afaq Hassan",
    address: "11, Tarnol, Rawalpindi",
    phone: "030000000",
    city: "Rawalpindi",
    payMethod: "Cash",
    status: ["Pending"],
    actions: ""
  },
  {
    key: "2",
    orderId: 22,
    productId: 32,
    productName: "Bike",
    des: "Red color bike with petrol",
    quantity: 1,
    size: "CD-70",
    cusName: "Afaq Hassan",
    address: "11, Tarnol, Rawalpindi",
    phone: "030000000",
    city: "Rawalpindi",
    payMethod: "Cash",
    status: ["Pending"],
    actions: ""
  }
];
class Orders extends Component {
  render() {
    return (
      <MainLayout {...this.props}>
        <h4>Orders </h4>
        <h6>This is Orders page!</h6>
        <Divider />
        <Table columns={columns} dataSource={data} />
      </MainLayout>
    );
  }
}

export default Orders;

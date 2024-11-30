import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";

const NFTListModel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    form.validateFields().then(() => {
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button>
      <Modal title="List NFT" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="price" label="price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="amount" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NFTListModel;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, Input, InputNumber, Layout, Radio, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import { iconColor, displayErrorMessage } from "../../lib/utils";

interface Props {
  viewer: Viewer;
}

const onBeforeImageUpload = (file: File) => {
  const validFileTypes = [ "image/jpeg", "image/png" ];
  const maxFileSize = 1024 * 1024; // 1MB

  if (!validFileTypes.includes(file.type)) {
    displayErrorMessage("Not supported file type");
    return false;
  }

  if (file.size > maxFileSize) {
    displayErrorMessage("Image file is too big");
    return false;
  }

  return true;
};

const getImageAsBase64 = (img: File|Blob, callback: (value: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
}

export const Host = (props: Props) => {
  const { viewer } = props;
  const [imgLoading, setImgLoading] = useState(false);
  const [imgBase64Value, setImgBase64Value] = useState<string|null>(null);

  const onHandleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImgLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getImageAsBase64(file.originFileObj, (data: string) => {
        setImgBase64Value(data);
        setImgLoading(false);
      });
    }
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a listing!
          </Typography.Title>
          <Typography.Text type="secondary">
            We only allow users who've signed in to our application and have connected
            with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly after.
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="host-content">
      <Form layout="vertical">
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Typography.Title>
          <Typography.Text type="secondary">
            In this form, we'll collect some basic and additional information about your
            listing.
          </Typography.Text>
        </div>

        <Form.Item label="Home Type">
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <Icon style={{ color: iconColor }} type="bank"/><span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
            <Icon style={{ color: iconColor }} type="home"/><span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Title" extra="Max. character count of 50">
          <Input maxLength={50} placeholder="Enter a title for your listing" />
        </Form.Item>

        <Form.Item label="Description" extra="Max. character count of 400">
          <Input.TextArea rows={3} maxLength={400} placeholder="Enter a description for your listing" />
        </Form.Item>

        <Form.Item label="Address">
          <Input placeholder="250 Great Avenue" />
        </Form.Item>

        <Form.Item label="City/Town">
          <Input placeholder="Los Angeles" />
        </Form.Item>

        <Form.Item label="State/Province">
          <Input placeholder="California" />
        </Form.Item>

        <Form.Item label="Zip/Postal Code">
          <Input placeholder="Postal code of your listing" />
        </Form.Item>

        <Form.Item label="Image" extra="Images must be smaller than 1MB and of type JPG or PNG">
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={onBeforeImageUpload}
              onChange={onHandleImageUpload}
            >
              {imgBase64Value ? (
                <img src={imgBase64Value} alt="Listing" />
              ) : (
                <div>
                  <Icon type={imgLoading ? "loading" : "plus"} />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>

        <Form.Item label="Price" extra="Prices in $USD/day">
          <InputNumber min={0} placeholder="120" />
        </Form.Item>

        <Form.Item>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );};

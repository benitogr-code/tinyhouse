import React, { FormEvent, useState } from "react";
import { useMutation } from "react-apollo";
import { Link, Redirect } from "react-router-dom";
import { Button, Form, Icon, Input, InputNumber, Layout, Radio, Typography, Upload } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { UploadChangeParam } from "antd/lib/upload";
import { ListingType } from "../../lib/graphql/globalTypes";
import { HostListing as HostListingQuery } from "../../lib/graphql/mutations";
import { HostListing as HostListingData, HostListingVariables } from "../../lib/graphql/mutations/__generated__/HostListing";
import { Viewer } from "../../lib/types";
import { iconColor, displayErrorMessage, displaySuccessNotification } from "../../lib/utils";

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

export const Host = (props: Props & FormComponentProps) => {
  const { viewer, form } = props;
  const [imgLoading, setImgLoading] = useState(false);
  const [imgBase64Value, setImgBase64Value] = useState<string|null>(null);
  const [hostListing, { loading, data }] = useMutation<HostListingData, HostListingVariables>(
    HostListingQuery,
    {
      onCompleted: () => {
        displaySuccessNotification("You've successfully created your listing.");
      },
      onError: () => {
        displayErrorMessage("Sorry we had problem creating your listing. Please try again later.")
      }
    });

  const onImageUpload = (info: UploadChangeParam) => {
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

  const onFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    form.validateFields((err, values) => {
      if (err) {
        displayErrorMessage("Please fill all required form fields");
        return;
      }

      const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;
      const input = {
        title: values.title as string,
        description: values.description as string,
        type: values.type as ListingType,
        numOfGuests: values.numOfGuests as number,
        address: fullAddress,
        image: imgBase64Value as string,
        price: values.price * 100,
      }

      hostListing({
        variables: { input }
      });
    });
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

  if (loading) {
    return (
      <Layout.Content className="host-content">
        <div className="host__form-header">
          <Typography.Title level={3} className="host__form-title">
            Please wait!
          </Typography.Title>
          <Typography.Text type="secondary">
            We are creating your listing now.
          </Typography.Text>
        </div>
      </Layout.Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />
  }

  const { getFieldDecorator } = form;
  const homeTypeDecorator = getFieldDecorator("type", {
    rules: [
      { required: true, message: "Please select a home type" }
    ]
  });
  const numGuestDecorator = getFieldDecorator("numOfGuests", {
    rules: [
      { required: true, message: "Please set max number of guests" }
    ]
  });
  const titleDecorator = getFieldDecorator("title", {
    rules: [
      { required: true, message: "Please enter a title" }
    ]
  });
  const descriptionDecorator = getFieldDecorator("description", {
    rules: [
      { required: true, message: "Please enter a description" }
    ]
  });
  const addressDecorator = getFieldDecorator("address", {
    rules: [
      { required: true, message: "Please enter an address" }
    ]
  });
  const cityDecorator = getFieldDecorator("city", {
    rules: [
      { required: true, message: "Please enter a city" }
    ]
  });
  const stateDecorator = getFieldDecorator("state", {
    rules: [
      { required: true, message: "Please enter a state or province" }
    ]
  });
  const postcodeDecorator = getFieldDecorator("postalCode", {
    rules: [
      { required: true, message: "Please enter a postal code" }
    ]
  });
  const imageDecorator = getFieldDecorator("image", {
    rules: [
      { required: true, message: "Please provide an image" }
    ]
  });
  const priceDecorator = getFieldDecorator("price", {
    rules: [
      { required: true, message: "Please provide a price" }
    ]
  });

  return (
    <Layout.Content className="host-content">
      <Form layout="vertical" onSubmit={onFormSubmit}>
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
          {
            homeTypeDecorator(
              <Radio.Group>
                <Radio.Button value={ListingType.APARTMENT}>
                  <Icon style={{ color: iconColor }} type="bank"/><span>Apartment</span>
                </Radio.Button>
                <Radio.Button value={ListingType.HOUSE}>
                <Icon style={{ color: iconColor }} type="home"/><span>House</span>
                </Radio.Button>
              </Radio.Group>
            )
          }
        </Form.Item>

        <Form.Item label="Max # of Guests">
          {
            numGuestDecorator(<InputNumber min={1} placeholder="4" />)
          }
        </Form.Item>

        <Form.Item label="Title" extra="Max. character count of 50">
          {
            titleDecorator(<Input maxLength={50} placeholder="Enter a title for your listing" />)
          }
        </Form.Item>

        <Form.Item label="Description" extra="Max. character count of 400">
          {
            descriptionDecorator(<Input.TextArea rows={3} maxLength={400} placeholder="Enter a description for your listing" />)
          }
        </Form.Item>

        <Form.Item label="Address">
          {
            addressDecorator(<Input placeholder="250 Great Avenue" />)
          }
        </Form.Item>

        <Form.Item label="City/Town">
          {
            cityDecorator(<Input placeholder="Los Angeles" />)
          }
        </Form.Item>

        <Form.Item label="State/Province">
          {
            stateDecorator(<Input placeholder="California" />)
          }
        </Form.Item>

        <Form.Item label="Zip/Postal Code">
          {
            postcodeDecorator(<Input placeholder="Postal code of your listing" />)
          }
        </Form.Item>

        <Form.Item label="Image" extra="Images must be smaller than 1MB and of type JPG or PNG">
          <div className="host__form-image-upload">
            {
              imageDecorator(
                <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={onBeforeImageUpload}
                onChange={onImageUpload}
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
              )
            }
          </div>
        </Form.Item>

        <Form.Item label="Price" extra="Prices in $USD/day">
          {
            priceDecorator(<InputNumber min={0} placeholder="120" />)
          }
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

export const WrappedHost = Form.create<Props & FormComponentProps>({
  name: "host_form"
})(Host);

/**
 * @file 信息管理-首页配置
 */

import { Upload, message, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { getToken } from '../../../utils/token';
import { updateMainUrlApi, uploadApi } from '../sever';

const fileType = [
  // 图片格式
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
];

export const accept = fileType.join(',');

export const beforeUpload = (file) => {
  // 判断图片大小不超过1MB
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('图片大小不能超过1MB!');
  }
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/gif';
  if (!isJpgOrPng) {
    message.error('仅支持 .JPG/ .PNG/ .JPEG/ .gif 文件!');
  }
  return isJpgOrPng;
};

const App = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const handleSubmit = () => {
    const urls = fileList.map((item) => item.response);

    if (urls.length === 0) {
      message.error('请上传图片');
      return;
    }
    setLoading(true);
    updateMainUrlApi(urls).then((res) => {
      console.log(res);
      message.success('提交成功', 1, () => {
        setFileList([]);
      });
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="bg-white">
      <h3>小程序首页轮播图配置</h3>
      <ImgCrop rotationSlider aspect={2}>
        <Upload
          action={uploadApi()}
          headers={{ Authorization: getToken() }}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={beforeUpload}
          accept={accept}
        >
          <PlusOutlined />
        </Upload>
      </ImgCrop>
      <Button type="primary" loading={loading} onClick={handleSubmit}>提交</Button>
    </div>
  );
};
export default App;

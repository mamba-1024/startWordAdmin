/**
 * @file 信息管理-信息编辑
 */
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import {
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormRadio,
  ProFormTextArea,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { uploadApi, uploadImgApi, addProductApi } from '../sever';
import { getToken } from '../../../utils/token';
import { accept, beforeUpload } from '../indexConfig';
import { useNavigate } from 'react-router-dom';

function MyEditor() {
  const navigate = useNavigate();
  // editor 实例
  const [editor, setEditor] = useState(null); // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState('');

  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setTimeout(() => {
  //     setHtml('<p>hello world</p>');
  //   }, 1500);
  // }, []);

  // 工具栏配置
  const toolbarConfig = {
    excludeKeys: ['uploadVideo', 'insertedVideo'],
  }; // JS 语法

  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadVideo: false,
      insertedVideo: false,
    },
  };

  editorConfig.MENU_CONF.uploadImage = {
    // 自定义图片上传配置
    async customUpload(file, insertFn) {
      // file 即选中的文件
      const res = await uploadImgApi(file);
      const url = res;
      // 自己实现上传，并得到图片 url alt href
      // 最后插入图片
      insertFn(url);
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 图片预览
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

  return (
    <>
      <ProForm
        onFinish={async (values) => {
          console.log(values);
          if (!html) {
            message.error('请输入正文内容');
            return;
          }
          const params = {
            title: values.title,
            productMainUrl: values.productMainUrl[0].response,
            shortDesc: values.shortDesc,
            showIndex: values.showIndex,
            htmlContent: html,
          };
          await addProductApi(params);
          message.success('提交成功', 1, () => {
            // 返回上一页
            navigate(-1);
          });
        }}
      >
        <ProFormText
          label="标题"
          width="md"
          name="title"
          // tooltip="最长为 24 位"
          placeholder="请输入标题"
          rules={[{ required: true }]}
        />
        <ProFormSwitch
          rules={[{ required: true }]}
          initialValue={false}
          name="showIndex"
          label="显示在首页"
          options={[
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false,
            },
          ]}
        />
        <ProFormTextArea
          rules={[{ required: true }]}
          label="简介"
          name="shortDesc"
          placeholder="请输入简介"
          maxLength={60}
        />
        <ProFormUploadButton
          rules={[{ required: true }]}
          label="主图"
          name="productMainUrl"
          max={1}
          action={uploadApi()}
          fieldProps={{
            headers: { Authorization: getToken() },
            accept,
          }}
          listType="picture-card"
          accept={accept}
          beforeUpload={beforeUpload}
          onPreview={onPreview}
        />
        <ProForm.Item label="正文内容" rules={[{ required: true }]}>
          <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
            <Toolbar
              editor={editor}
              defaultConfig={toolbarConfig}
              mode="default"
              style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
              defaultConfig={editorConfig}
              value={html}
              onCreated={setEditor}
              onChange={(edit) => setHtml(edit.getHtml())}
              mode="default"
              style={{ height: '500px', overflowY: 'hidden' }}
            />
          </div>
        </ProForm.Item>
      </ProForm>
      <h1>预览</h1>
      <div style={{ marginTop: '15px' }} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

export default MyEditor;

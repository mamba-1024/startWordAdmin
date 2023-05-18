/**
 * @file 信息管理-信息编辑
 */
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect, useRef } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import {
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProFormTextArea,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { message, Skeleton, Button, Drawer } from 'antd';
import {
  uploadApi,
  uploadImgApi,
  addProductApi,
  addEntActionApi,
  productDetailApi,
  entActionDetailApi,
  editProductApi,
  editEntActionApi,
} from '../sever';
import { getToken } from '../../../utils/token';
import { accept, beforeUpload } from '../indexConfig';
import { useNavigate, useSearchParams } from 'react-router-dom';

function MyEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef();
  // 详情id
  const id = searchParams.get('id');
  // 详情 type
  const type = searchParams.get('type');
  // 编辑还是新增
  const action = searchParams.get('action');

  // editor 实例
  const [editor, setEditor] = useState(null); // JS 语法
  // 编辑器内容
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  // 详情数据
  const [detail, setDetail] = useState();

  const [open, setOpen] = useState(false);

  // 编辑的时候需要先获取详情
  useEffect(() => {
    if (action === 'edit') {
      let func;
      if (type === 'product') {
        func = productDetailApi;
      } else {
        func = entActionDetailApi;
      }
      if (id && type) {
        setLoading(true);
        func({ id })
          .then((res) => {
            setDetail(res);
            setHtml(res.htmlContent);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [id, type, action]);

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

  return loading ? (
    <Skeleton />
  ) : (
    <>
      <ProForm
        formRef={formRef}
        onFinish={async (values) => {
          if (!html) {
            message.error('请输入正文内容');
            return;
          }
          const params = {
            title: values.title,
            [type === 'product' ? 'productMainUrl' : 'actionMainUrl']: values.productMainUrl[0].response,
            shortDesc: values.shortDesc,
            htmlContent: html,
          };
          if (type === 'product') {
            params.showIndex = values.showIndex;
          }
          let func;
          if (action === 'edit') {
            params.id = id;
            if (type === 'product') {
              func = editProductApi;
            } else {
              func = editEntActionApi;
            }
          } else if (type === 'product') {
            func = addProductApi;
          } else {
            func = addEntActionApi;
          }
          await func(params);
          const messageText = action === 'edit' ? '编辑成功' : '新增成功';
          message.success(messageText, 1, () => {
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
          initialValue={detail?.title}
        />
        {
          type === 'product' ? (
            <ProFormSwitch
              rules={[{ required: true }]}
              initialValue={detail?.showIndex || false}
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
            />) : null
        }

        <ProFormTextArea
          rules={[{ required: true }]}
          label="简介"
          name="shortDesc"
          placeholder="请输入简介"
          maxLength={60}
          initialValue={detail?.shortDesc}
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
          formItemProps={{
            initialValue: detail?.productMainUrl || detail?.actionMainUrl ? [{ status: 'done', url: detail?.productMainUrl || detail?.actionMainUrl }] : [],
          }}
        />
        <ProForm.Item label="正文内容" rules={[{ required: true }]} extra={<Button style={{ marginTop: 10 }} type="primary" ghost onClick={() => setOpen(true)}>预览</Button>}>
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
              style={{ height: '400px', overflowY: 'hidden' }}
            />
          </div>
        </ProForm.Item>
      </ProForm>
      <Drawer title="正文内容预览" placement="right" onClose={() => setOpen(false)} open={open} zIndex={1200}>
        <div style={{ marginTop: '15px' }} dangerouslySetInnerHTML={{ __html: html }} />
      </Drawer>
    </>
  );
}

export default MyEditor;

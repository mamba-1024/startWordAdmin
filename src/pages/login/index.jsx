import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import './index.less';
import { useTranslation } from 'react-i18next';
import { request } from '../../utils/request';
import { getToken } from '../../utils/token';

function App() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = (values) => {
    setLoading(true);

    request({
      url: '/backend/login/login',
      method: 'post',
      data: values,
    })
      .then((res) => {
        getToken(res);
        message.success('登录成功', 1, () => {
          navigate('/dashboard');
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container h-screen pt-28">
      <Form
        name="normal_login"
        className="login-form bg-white py-12 rounded-md mx-auto px-8 shadow-md"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            placeholder="账户 admin"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        {/* <Form.Item>
          <a className="login-form-forgot" href=" ">
            {t('login.forgotPassword')}
          </a>
        </Form.Item> */}

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
            {t('login.confirm')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;

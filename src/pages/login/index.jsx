import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Image, message } from 'antd';
import './index.less';
import { request } from '../../utils/request';
import { saveToken } from '../../utils/token';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import logo from '../../public/logo.png';

function App() {
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
        saveToken(res);
        message.success('登录成功', 1, () => {
          navigate('/dashboard');
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container h-screen bg-white pt-10">
      <LoginForm
        logo={<Image src={logo} width={100} preview={false} />}
        title={<div className="text-transparent text-2xl">后台</div>}
        subTitle={<div className="font-bold text-xl">杭州南方化工设备有限公司</div>}
        onFinish={onFinish}
        loading={loading}
      >
        <ProFormText
          name="name"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'用户名: admin'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'密码: '}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginForm>
      {/* <Form
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

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
            {t('login.confirm')}
          </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
}

export default App;

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { Form, Input, Button } from 'antd';
import { message } from 'antd';
import { Link } from 'react-router-dom';

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const showMessage = (msg) => {
    message.error(msg);
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form }).catch(
        (err) => {
          console.log({ err });
          showMessage(err.message);
        }
      );
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '5%',
      }}
    >
      <h1
        style={{
          marginBottom: '20px',
        }}
      >
        Авторизация
      </h1>
      <Form
        style={{ width: '70%', paddingRight: '13%' }}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            placeholder="Введите email"
            id="email"
            type="text"
            name="email"
            value={form.email}
            onChange={changeHandler}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Введите пароль"
            id="password"
            type="password"
            name="password"
            value={form.password}
            className="yellow-input"
            onChange={changeHandler}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        ></Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            disabled={loading}
            onClick={loginHandler}
            style={{ marginRight: '10px' }}
          >
            Войти
          </Button>

          <Link to="/reg" replace>
            <Button disabled={loading}>Регистрация</Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

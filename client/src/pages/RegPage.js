import React, { useState } from 'react';

import { useHttp } from '../hooks/http.hook';
import { Form, Input, Button } from 'antd';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { API_PATH } from '../constants';

export const RegPage = () => {
  const { loading, request } = useHttp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request(`${API_PATH}auth/register`, 'POST', {
        ...form,
      });
      await message.success(data.message);
    } catch (e) {
      showMessage(e.message);
    }
  };

  const showMessage = (msg) => {
    message.error(msg);
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
        Регистрация
      </h1>
      <Form
        style={{ width: '70%', paddingRight: '15%' }}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            placeholder="Введите имя пользователя"
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={changeHandler}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
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
            onClick={registerHandler}
            disabled={loading}
            style={{ marginRight: '10px' }}
          >
            Зарегистрироваться
          </Button>
          <Link to="/" replace>
            <Button>Войти</Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

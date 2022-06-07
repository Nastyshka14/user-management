import { Button, PageHeader } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    navigate('/');
  };
  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Список пользователей"
      extra={[
        <Button key="1" type="primary" onClick={logoutHandler}>
          Выйти
        </Button>,
      ]}
    ></PageHeader>
  );
};

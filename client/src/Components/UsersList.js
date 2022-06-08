import React, { useContext, useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DeleteOutlined } from '@ant-design/icons';
import { API_PATH } from '../constants';

const columns = [
  {
    title: 'ID',
    dataIndex: '_id',
  },

  {
    title: 'Имя пользователя',
    dataIndex: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Дата регистрации',
    dataIndex: 'registrationDate',
  },
  {
    title: 'Дата последнего логина',
    dataIndex: 'lastLoginDate',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
  },
];

export const UsersList = () => {
  const { request } = useHttp();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const data = users.map((user) => ({
    ...user,
    key: user._id,
    lastLoginDate: new Date(user.lastLoginDate).toLocaleString('en-US'),
    registrationDate: new Date(user.registrationDate).toLocaleString('en-US'),
  }));

  const user = JSON.parse(localStorage.getItem('userData'));
  const userId = user
    ? JSON.parse(localStorage.getItem('userData')).userId
    : null;

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const logoutHandler = () => {
    auth.logout();
    navigate('/');
  };

  useEffect(() => {
    if (userId) {
      fetch(`${API_PATH}auth/user/${userId}`)
        .then((res) => res.json())
        .then((resp) => {
          if (!resp || resp.user.status === 'inactive') {
            logoutHandler();
          }
        });
    }
  });

  useEffect(() => {
    fetch(`${API_PATH}auth/users`)
      .then((res) => res.json())
      .then(
        (resp) => {
          setUsers(resp.users);
        },
        (error) => console.log(error)
      );
  }, []);

  const onSelectChange = (newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
  };

  const rowSelection = {
    selectedUsers,
    onChange: onSelectChange,
  };

  const changeStatusHandler = async (ids, status) => {
    try {
      const checkUserWithSameStatus = users
        .filter((user) => selectedUsers.includes(user._id))
        .some((user) => user.status === status);
      if (checkUserWithSameStatus) {
        message.warning(
          `You can block ONLY users with status ${
            status === 'active' ? 'inactive' : 'active'
          }`
        );
        return;
      } else if (selectedUsers.length) {
        const data = await request(`${API_PATH}auth/user`, 'PUT', { ids, status });
        const updatedUserList = users.map((user) =>
          ids.includes(user._id) ? { ...user, status } : user
        );
        setUsers(updatedUserList);

        message.success(data.message);
        return;
      } else {
        message.warning('Select at least ONE user');
        return;
      }
    } catch (e) {
      message.error('Something went wrong, try again');
    }
  };

  const deleteUsersHandler = async (ids) => {
    try {
      if (ids.length) {
        const data = await request(`${API_PATH}auth/users`, 'DELETE', { ids });
        const updatedUserList = users.filter((user) => !ids.includes(user._id));
        if (!updatedUserList.includes(user._id)) {
          logoutHandler();
        }
        setUsers(updatedUserList);

        message.success(data.message);
      } else {
        message.warning('Select at least ONE user');
      }
    } catch (error) {
      message.error('Something went wrong, try again');
    }
  };

  return (
    <>
      <div>
        <div
          style={{ display: 'flex', justifyContent: 'end', paddingRight: '5%' }}
        >
          <Button
            style={{ margin: '5px' }}
            onClick={() => changeStatusHandler(selectedUsers, 'inactive')}
          >
            Заблокировать
          </Button>
          <Button
            style={{ margin: '5px' }}
            onClick={() => changeStatusHandler(selectedUsers, 'active')}
          >
            Разблокировать
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            style={{ margin: '5px' }}
            onClick={() => deleteUsersHandler(selectedUsers)}
          ></Button>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    </>
  );
};

import React from 'react';
import { UsersList } from '../Components/UsersList';

export const UsersPage = () => {
  const users = JSON.parse(localStorage.getItem('userData'));
  console.log(users);
  return <>{<UsersList users={users} />}</>;
};

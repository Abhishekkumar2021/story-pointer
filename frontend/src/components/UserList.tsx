import React from 'react';
import UserAvatar from './UserAvatar';

interface User {
  username: string;
  points: number;
  showPoints: boolean;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="p-10">
      <ul className="flex gap-6 flex-wrap justify-center">
        {users.map((user, idx) => (
          <li key={idx} className="flex flex-col items-center">
            <UserAvatar user={user}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
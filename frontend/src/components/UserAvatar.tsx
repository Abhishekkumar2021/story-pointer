import React from 'react';
import { FaCreativeCommonsZero } from "react-icons/fa";



interface User {
  username: string;
  points: number;
  showPoints: boolean;
}

interface UserAvatarProps {
  user: User;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 text-2xl bg-white rounded-full shadow-md flex items-center justify-center">
        {user.showPoints ? (
          user.points ? (
            <span className="text-green-600 font-semibold">{user.points}</span>
          ) : (
            <span className="text-gray-400 italic"><FaCreativeCommonsZero /></span>
          )
        ) : (
          <span className="text-gray-400">&#x1f440;</span>
        )}
      </div>
      <div className="text-sm text-center bg-white shadow-md py-2 px-4 rounded-md">{user.username}</div>
    </div>
  );
};

export default UserAvatar;
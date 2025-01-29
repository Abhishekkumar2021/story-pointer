/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { joinSession, leaveSession, updatePoints, onUserJoined, onUserLeft, onPointsUpdated, onError, getSocket, rejoinSession, onShowPointsToggled, toggleShowPoints, onUserRejoined } from '../services/socket';
import toast from 'react-hot-toast';
import { getUsers } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserList from '../components/UserList';
import { LuLogOut } from "react-icons/lu";
import { BiSolidShow } from "react-icons/bi";
import { MdHideSource } from "react-icons/md";
import Summary from '../components/Summary';


interface User {
  username: string;
  points: number;
  showPoints: boolean;
}

const Session: React.FC = () => {
  const options = [1, 2, 3, 5, 8, 13, 21, 44];
  const [isJoined, setIsJoined] = useState(false);
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);


  const handleError = useCallback((error: any, message: string) => {
    toast.error(`${message}: ${error instanceof Error ? error.message : "Something went wrong"}`);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!sessionId) {
      toast.error("Invalid session ID!");
      navigate('/error');
      return;
    }


    const storedUsername = localStorage.getItem(`${sessionId}_username`);
    setUsername(storedUsername || '');
    try {
      const users = await getUsers(sessionId!);
      setUsers(users);

      if (storedUsername && users.some(user => user.username === storedUsername)) {
        rejoinSession(sessionId!, storedUsername);
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch users');
    }
  }, [sessionId, navigate, handleError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handleUserJoined = (data: User) => {
      setIsJoined(true);
      setUsers((prev) => [...prev, data]);
      localStorage.setItem(`${sessionId}_username`, data.username);
      toast.success(`${data.username} joined!`);

    };
    const handleUserRejoined = (data: User) => {
      setIsJoined(true);
      toast.success(`${data.username} joined!`);
    };

    const handleUserLeft = (data: { username: string }) => {
      setUsers((prev) => prev.filter((user) => user.username !== data.username));
      toast.success(`${data.username} left!`);
    };

    const handlePointsUpdated = (data: User) => {
      setUsers((prev) =>
        prev.map((user) => (user.username === data.username ? data : user))
      );
      toast.success("Points updated!");
    };

    const handleShowPointsToggled = (data: { username: string; showPoints: boolean }) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.username === data.username ? { ...user, showPoints: data.showPoints } : user
        )
      );
    };

    onUserJoined(handleUserJoined);
    onUserRejoined(handleUserRejoined)
    onUserLeft(handleUserLeft);
    onPointsUpdated(handlePointsUpdated);
    onShowPointsToggled(handleShowPointsToggled);
    onError((error: any) => handleError(error, 'Socket error'));

    return () => {
      const socket = getSocket();
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('pointsUpdated', handlePointsUpdated);
      socket.off('showPointsToggled', handleShowPointsToggled);
      socket.off('error', (error: any) => handleError(error, 'Socket error'));
    };
  }, [handleError, sessionId]);

  const handleJoin = () => {
    if (!username.trim()) {
      toast.error("Username is required to join the session.");
      return;
    }
    joinSession(sessionId!, username);
    setIsJoined(true);
  };

  const handleLeave = () => {
    leaveSession(sessionId!, username);
    localStorage.removeItem(`${sessionId}_username`);
    setIsJoined(false);
    navigate('/');
  };

  const handleUpdatePoints = (points: number) => {
    updatePoints(sessionId!, username, points);
  };

  const handleShowPoints = () => {
    toggleShowPoints(sessionId!, username);
  }

  const canShowPoints = useMemo(() => {
    const user = users.find(user => user.username === username)
    if (!user) return false
    return user.showPoints
  }, [username, users]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      <Header sessionId={sessionId!} />
      {!isJoined ? (
        <div className="flex flex-1 flex-col p-4 justify-center items-center">
          <div className="flex flex-col bg-white shadow-md p-6 rounded-2xl w-80">
            <h1 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
              Join Session
            </h1>
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleJoin}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Join Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between items-center w-full p-4">
            {/* Buttons Section */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handleLeave}
                className="bg-red-500 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
              >
                <LuLogOut className='text-2xl' /> Leave Session
              </button>
              <button
                onClick={handleShowPoints}
                className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-all"
              >
                {canShowPoints ? <p className='flex items-center gap-2'><MdHideSource className='text-2xl' /> Hide Points</p> : <p className='flex items-center gap-2'><BiSolidShow className='text-2xl' /> Show Points</p>}
              </button>
            </div>
          </div>
          <div className="flex gap-2 p-4 justify-center">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleUpdatePoints(option)}
                className="bg-green-500 text-white px-4 py-2 border-2 border-green-500 rounded-full w-14 h-14 hover:bg-transparent hover:text-green-500 transition-all"
              >
                {option}
              </button>
            ))}
          </div>
          <UserList users={users} />
          <Summary users={users} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Session;

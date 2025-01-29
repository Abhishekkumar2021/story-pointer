/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { createSession } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { IoCreate } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";

const SessionForm: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { sessionId } = await createSession(sessionName);
      toast.success("Successfully created the session!");
      navigate(`/session/${sessionId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/session/${sessionId}`);
  };

  return (
    <form className="flex-1 flex items-center justify-center gap-4 flex-wrap p-8">
      {/* Create Session Section */}
      <div className="flex flex-col bg-white p-8 shadow-md rounded-2xl w-80">
        <h1 className="flex gap-2 text-2xl font-semibold items-center text-blue-600">
          <IoCreate className="text-3xl" />
          Create Session
        </h1>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Session Name"
          required
          className="mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          onClick={handleCreate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Create Session
        </button>
      </div>

      {/* Join Session Section */}
      <div className="flex flex-col bg-white p-8 shadow-md rounded-2xl w-80">
        <h1 className="flex gap-2 text-2xl font-semibold items-center text-blue-600">
          <RiLoginCircleFill className="text-3xl" />
          Join Session
        </h1>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Session ID"
          required
          className="mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          onClick={handleJoin}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Join Session
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL;

interface User {
  username: string;
  points: number;
  showPoints: true
}

export const createSession = async (sessionName: string) => {
  try {
    const response = await axios.post(`${API_URL}/session`, { sessionName });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while creating the session');
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    await axios.delete(`${API_URL}/session/${sessionId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while deleting the session');
  }
};


export const getUsers = async (sessionId: string): Promise<User[]> => {
  try {
    const {data} =  await axios.get(`${API_URL}/users/${sessionId}`);
    return data?.users || []
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the users');
  }
};

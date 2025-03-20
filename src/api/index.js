import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io';

// Giriş
export const signIn = async () => {
  const response = await axios.post(
    `${BASE_URL}/sign-in-request`,
    {
      email: 'salar@beije.co',
      password: 'beijeApp',
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const token = response.data.data.token;
  await AsyncStorage.setItem('token', token);
  return token;
};

// Profil bilgisi çekme
export const getProfile = async token => {
  const response = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data.data);
  return response.data.data;
};

// Regl günleri çekme
export const getMenstruationDays = async token => {
  const response = await axios.get(`${BASE_URL}/menstruation-days`, {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data.data);
  return response.data.data;
};

// Insights çekme
export const getInsights = async token => {
  const response = await axios.get(`${BASE_URL}/insights`, {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data.data);
  return response.data.data;
};

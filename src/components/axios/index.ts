import { IAlbum, IUser } from './../config/interface';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://jsonplaceholder.typicode.com/',
});

export const fetchData = async (url: string) => {
  const data = await axiosInstance.get(url);
  return data;
};

export const putData = (url: string, data: IUser) => {
  const putNewUserInfo = axiosInstance.put(url, data);
  return putNewUserInfo;
};

export const postData = (url: string, data: IUser | IAlbum[]) => {
  const postNewAlbum = axiosInstance.post(url, data);
  return postNewAlbum;
};

export const deleteData = (url: string) => {
  const deleteData = axiosInstance.delete(url);
  return deleteData;
};

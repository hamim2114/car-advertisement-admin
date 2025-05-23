import {axiosReq} from './axiosReq';

export const uploadImage = async (img) => {
  try {
    const data = new FormData();
    data.append('my_file', img);

    const res = await axiosReq.post('/file/upload', data);
    return res.data;
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const deleteImage = async (publicId) => {
  try {
    const response = await axiosReq.post('/file/delete', {publicId});
    return response.data.success;
  } catch (error) {
    console.error(error);
  }
};

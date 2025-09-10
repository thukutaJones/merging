import { baseUrl } from "@/constants/baseUrl";
import axios from "axios";

export const retriveUserData = async (email: string, token: string) => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/user/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = res?.data;
    console.log(user);
    return user;
  } catch (error: any) {
    console.log(error);
  }
};

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", 
});

export const sendMessage = async (
  channel: string,
  to: string,
  message: any
) => {
  const response = await api.post("/send", {
    channel: channel.toLowerCase(), 
    to,
    message,
  });
  return response.data;
};

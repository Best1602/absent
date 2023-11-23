import { useSelector } from "react-redux";

export const useUserName = () => {
  const name = useSelector((state) => state.auth.userName);
  return name;
};

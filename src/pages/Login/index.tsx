import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { loginGoogle } from "api/auth";
import { setCookies } from "helpers/cookies";
import useAuthStore from "store/AuthStore";

import { ECOOKIES_KEY } from "constants/index";
import { routePaths } from "routes/constants";

const Login: React.FC = () => {
  const onSetIsLogin = useAuthStore((state) => state.onSetIsLogin);
  const onSetUser = useAuthStore((state) => state.onSetUser);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onError: (err) => {
      console.error(err);
    },
    flow: "auth-code",
    onSuccess: async (res) => {
      try {
        console.log(res);
        const {
          data: { data },
        } = await loginGoogle({
          token: res.code,
        });
        setCookies(ECOOKIES_KEY.ACCESS_TOKEN, data.accessToken);
        setCookies(ECOOKIES_KEY.REFRESH_AUTH, data.refreshToken);
        onSetUser(data.user);
        onSetIsLogin(data.user.subscriptionActive);
        navigate(routePaths.root.root);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleLogin = () => {
    login();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[10rem] ">
        <img src="/logo.png" alt="" />
        <button onClick={handleLogin}>Login with google</button>
      </div>
    </div>
  );
};

export default Login;

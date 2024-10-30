import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { GoogleIcon } from "components/icons";

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
        const {
          data: { data },
        } = await loginGoogle({
          token: res.code,
        });
        setCookies(ECOOKIES_KEY.ACCESS_TOKEN, data.accessToken);
        setCookies(ECOOKIES_KEY.REFRESH_AUTH, data.refreshToken);
        setCookies(ECOOKIES_KEY.EMAIL, data.user.email);
        setCookies(ECOOKIES_KEY.USER_ID, String(data.user.id));
        onSetUser(data.user);
        onSetIsLogin(true);
        //TODO handle subs
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
    <div className="w-screen h-screen flex items-center justify-center bg-background-800">
      <div className="w-fit  px-8 py-8 flex border rounded-xl flex-col items-center border-background-500 bg-background-700 shadow-sm shadow-background-400">
        <img className="w-[30rem] mb-5" src="/images/logo.png" alt="Multi Ai" />
        <p className="mb-5 font-medium text-lg">
          Sign in to start using MultiAi
        </p>
        <button
          className="flex w-fit whitespace-pre px-8 items-center hover:bg-background-500 transition  text-foreground-400 pt-3 pb-4 bg-background-400 font-medium rounded-full text-xl shadow"
          onClick={handleLogin}
        >
          <GoogleIcon className="w-8 h-8 mr-1" />
          <div className="">Continue with google </div>
        </button>
      </div>
    </div>
  );
};

export default Login;

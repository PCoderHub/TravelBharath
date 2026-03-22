import Input from "../../components/Form/Input";
import Button from "../../components/Button";
import { useState } from "react";
import { userLogin } from "../../services/userServices";
import { saveUserAndTokens } from "../../utils/saveUser";
import { useNavigate } from "react-router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const [ serverError, setServerError ] = useState("");

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials = { email, password };
      const { user, access, refresh } = await userLogin(credentials);

      saveUserAndTokens({ user, access, refresh });

      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl lg:text-6xl xl:text-8xl font-bold text-lime-600 mt-12">
        Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center p-10"
      >
        <Input type="email" value={email} onChange={handleChange(setEmail)} />
        <Input
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
        />
        <Button
          activity={loading ? "Logging in..." : "Login"}
          loading={loading}
        />
      </form>
    </>
  );
}

export default Login;

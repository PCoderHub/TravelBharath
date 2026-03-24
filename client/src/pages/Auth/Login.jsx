import Input from "../../components/Form/Input";
import Button from "../../components/Button";
import { useRef, useState } from "react";
import { userLogin } from "../../services/userServices";
import { saveUserAndTokens } from "../../utils/saveUser";
import { useNavigate } from "react-router";
import { useError } from "../../hooks/useError";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePromiseRef = useRef(false);

  const navigate = useNavigate();
  const { notifyError, notifyPromise } = useError();

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return notifyError("Email and password required");

    if (activePromiseRef.current) return;

    activePromiseRef.current = true;
    setIsSubmitting(true);

    const credentials = { email, password };

    try {
      const { user, access, refresh } = await notifyPromise(
        userLogin(credentials),
        {
          loading: "Logging in...",
          success: "Logged in successfully",
        },
      );

      saveUserAndTokens({ user, access, refresh });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      activePromiseRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-4xl lg:text-6xl font-bold text-lime-600 mt-12">
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
          activity={isSubmitting ? "Logging in..." : "Login"}
          disabled={isSubmitting}
        />
      </form>
    </>
  );
}

export default Login;

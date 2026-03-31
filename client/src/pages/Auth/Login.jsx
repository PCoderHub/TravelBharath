import Input from "../../components/Form/Input";
import Button from "../../components/Button";
import { useState } from "react";
import { userLogin } from "../../services/userServices";
import { Navigate, useNavigate } from "react-router";
import { useError } from "../../hooks/useError";
import { validateLogin } from "../../utils/validators/validateLogin";
import { useAuth } from "../../hooks/useAuth.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();
  const { notifyPromise } = useError();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let validationErrors = validateLogin({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});
    [];
    setIsSubmitting(true);

    try {
      const { user, access, refresh } = await notifyPromise(
        userLogin({ email, password }),
        {
          loading: "Logging in...",
          success: "Logged in successfully",
        },
      );

      login(user, { access, refresh });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && isAdmin)
    return <Navigate to="/admin/dashboard" replace />;

  return (
    <>
      <h1 className="text-center text-4xl lg:text-6xl font-bold text-lime-600 mt-12">
        Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center p-10"
      >
        <Input
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          error={error.email}
        />
        <Input
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
          error={error.password}
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

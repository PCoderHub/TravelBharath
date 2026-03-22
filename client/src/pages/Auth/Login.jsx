import React from "react";
import Input from "../../components/Form/Input";
import Button from "../../components/Button";

function Login() {
  return (
    <>
      <h1 className="text-center text-4xl lg:text-8xl xl:text-9xl font-bold text-lime-600 mt-12">
        Login
      </h1>
      <form className="flex flex-col items-center justify-center p-10">
        <Input type="email" />
        <Input type="password" />
        <Button activity="Login" />
      </form>
    </>
  );
}

export default Login;

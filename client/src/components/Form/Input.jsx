import React from "react";

function Input({ type, value, onChange, error = null }) {
  let title;
  if (type === "email") {
    title = "Email";
  } else if (type === "password") {
    title = "Password";
  }

  return (
    <>
      <label
        className="block text-gray-700 text-sm lg:text-xl font-bold mb-2"
        htmlFor={type}
      >
        {title}
      </label>
      <input
        className="border rounded w-90 py-2 px-3 w-full md:w-1/2 xl:w-1/3 text-gray-700 text-md lg:text-xl leading-tight focus:outline-none focus:shadow-outline my-2"
        id={type}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={title}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
}

export default Input;

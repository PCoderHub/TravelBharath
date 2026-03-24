import React from "react";

function Button({ activity, disabled = false }) {
  return (
    <button
      className={`bg-yellow-500 hover:bg-yellow-600 text-white lg:text-2xl font-bold py-2 px-4 lg:py-2 lg:px-8 rounded-full my-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {activity}
    </button>
  );
}

export default Button;

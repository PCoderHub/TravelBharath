import React from "react";

function Button({ activity, loading = false }) {
  return (
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-white lg:text-2xl font-bold py-2 px-4 lg:py-4 lg:px-8 rounded-full my-2"
      disabled={loading}
    >
      {activity}
    </button>
  );
}

export default Button;

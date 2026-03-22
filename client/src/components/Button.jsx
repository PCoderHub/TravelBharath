import React from "react";

function Button({ activity }) {
  return (
    <button className="bg-yellow-500 hover:bg-yellow-600 text-white lg:text-2xl font-bold py-2 px-4 lg:py-4 lg:px-8 rounded-full my-2">
      {activity}
    </button>
  );
}

export default Button;

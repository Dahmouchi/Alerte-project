import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-gray-800 rounded-full dark:text-white"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;

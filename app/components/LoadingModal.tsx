"use client";

import { ClipLoader } from "react-spinners";

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-5 backdrop-blur-sm">
      <ClipLoader size={40} color="#0284c7" />
    </div>
  );
};

export default LoadingModal;

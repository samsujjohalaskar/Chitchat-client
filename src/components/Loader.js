import React, { useState, useEffect } from "react";

const Loader = () => {
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    if (countdown === 0) {
      window.location.reload();
    }
  };

  return (
    <div className="fixed flex flex-col justify-center items-center text-white top-0 left-0 w-full h-full bg-loading z-50">
      <div className="flex justify-center items-center">
        <div className="loader mr-2"></div>
        <p>
          Connecting...
          <span
            onClick={handleRefresh}
            className={`${countdown === 0 && "cursor-pointer hover:underline"} `}
          >
            Refresh
          </span>
          {countdown > 0 && ` in ${countdown} Seconds`}
        </p>
      </div>
    </div>
  );
};

export default Loader;

import { useEffect, useRef, useState } from "react";

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Lightning = () => {
  const [percent, setPercent] = useState(100);

  const percentRef = useRef(percent);

  useEffect(() => {
    const interval = setInterval(() => {
      percentRef.current = percentRef.current - random(5, 10);

      if (percentRef.current <= 0) {
        percentRef.current = 0;
        clearInterval(interval);
      }

      setPercent(percentRef.current);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="relative w-[400px] h-[200px] bg-white overflow-hidden">
        <img
          src="/lightning.png"
          className="absolute w-full h-full inline-block z-10"
        />
        <div
          style={{ transform: `translateX(-${percent}%)` }}
          className="absolute top-0 bottom-0 left-0 bg-orange-500 right-0 z-0 -translate-x-full"
        ></div>
      </div>
    </div>
  );
};

export default Lightning;

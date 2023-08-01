import { useEffect, useRef } from "react";

const Lightning = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current!;

    const mouseMove = (e: MouseEvent) => {
      cursor.style.top = `${e.pageY}px`;
      cursor.style.left = `${e.pageX}px`;
    };

    document.addEventListener("mousemove", mouseMove);
    return () => {
      document.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div className="cursor-container">
      <ul>
        <li>Home</li>
        <li>Contact</li>
        <li>About</li>
        <li>Team</li>
        <li>History</li>
        <div className="cursor" ref={cursorRef}></div>
      </ul>
    </div>
  );
};

export default Lightning;

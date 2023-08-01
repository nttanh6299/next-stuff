import { useEffect, useRef } from "react";

const Lightning = () => {
  useEffect(() => {
    const link = document.querySelectorAll(
      ".hover-this"
    ) as unknown as HTMLElement[];
    const cursor = document.querySelector(".cursor") as unknown as HTMLElement;

    console.log(link);

    const animate = function (e: MouseEvent) {
      const currentEle = e.currentTarget as HTMLElement;
      const span = currentEle.querySelector("span")!;

      const { offsetX: x, offsetY: y } = e;
      const { offsetWidth: width, offsetHeight: height } = currentEle;

      const move = 25;
      const xMove = (x / width) * (move * 2) - move;
      const yMove = (y / height) * (move * 2) - move;

      span.style.transform = `translate(${xMove}px,${yMove}px)`;

      if (e.type === "mouseleave") {
        span.style.transform = ``;
      }
    };

    const editCursor = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cursor) {
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
      }
    };

    link.forEach((b) => b.addEventListener("mousemove", animate));
    link.forEach((b) => b.addEventListener("mouseleave", animate));
    document.addEventListener("mousemove", editCursor);
  }, []);

  return (
    <div className="cursor-container-2">
      <ul>
        <li className="hover-this">
          <span>Home</span>
        </li>
        <li className="hover-this">
          <span>Contact</span>
        </li>
        <li className="hover-this">
          <span>About</span>
        </li>
        <div className="cursor"></div>
      </ul>
    </div>
  );
};

export default Lightning;

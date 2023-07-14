import { useEffect, useRef } from "react";

let tID: NodeJS.Timeout;
const slice = 233;

const Sprites = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseOut = () => {
      clearInterval(tID);
    };

    const onMouseOver = () => {
      let position = slice;
      const interval = 100;

      tID = setInterval(() => {
        if (ref.current) {
          ref.current.style.backgroundPosition = `-${position}px 0px`;
        }
        if (position < 1400 - slice) {
          position = position + slice;
        } else {
          position = slice;
        }
      }, interval);
    };

    if (ref.current) {
      ref.current.addEventListener("mouseover", onMouseOver);
      ref.current.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mouseover", onMouseOver);
        ref.current.removeEventListener("mouseout", onMouseOut);
      }
    };
  }, []);

  return (
    <div id="demo">
      <p id="image" ref={ref}></p>
    </div>
  );
};

export default Sprites;

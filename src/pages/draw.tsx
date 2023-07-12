import { useCallback, useEffect, useRef, useState } from "react";

const canvasImgId = "canvasImg";
const canvasDrawId = "canvasDraw";
// const brushColor = "black";

let prevX: number;
let prevY: number;
let currX: number;
let currY: number;
let flag: boolean;
let dot_flag: boolean;
let is_something_drawn: boolean;

function addImageProcess(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [paintSize, setPaintSize] = useState(25);
  const [isErase, setIsErase] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>();
  const ctxRef = useRef<CanvasRenderingContext2D>();

  const toggleErase = () => {
    if (ctxRef.current) {
      ctxRef.current.globalCompositeOperation = !isErase
        ? "destination-out"
        : "source-over";
      setIsErase((prev) => !prev);
    }
  };

  const clearInpaint = useCallback(() => {
    if (canvasRef.current && ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      is_something_drawn = false;
    }
  }, []);

  const findXy = (type: string, e: any) => {
    if (!canvasRef.current || !ctxRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.fillStyle = "black";

    if (type === "down") {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.getBoundingClientRect().x;
      currY = e.clientY - canvas.getBoundingClientRect().y;

      flag = true;
      dot_flag = true;
      if (dot_flag) {
        let xmul = canvas.width / canvas.offsetWidth;
        let ymul = canvas.height / canvas.offsetHeight;
        ctx.beginPath();
        ctx.arc(
          currX,
          currY,
          paintSize * Math.sqrt(xmul * ymul),
          0,
          2 * Math.PI
        );
        ctx.clearRect;
        ctx.fill();
        dot_flag = false;
      }
    }

    if (type === "up" || type === "out") {
      flag = false;
    }

    if (type === "move") {
      if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.getBoundingClientRect().x;
        currY = e.clientY - canvas.getBoundingClientRect().y;
        // draw();

        let xmul = canvas.width / canvas.offsetWidth;
        let ymul = canvas.height / canvas.offsetHeight;
        ctx.beginPath();
        ctx.arc(
          prevX * xmul,
          prevY * ymul,
          paintSize * Math.sqrt(xmul * ymul),
          0,
          2 * Math.PI
        );
        ctx.arc(
          ((prevX + currX) * xmul) / 2,
          ((prevY + currY) * ymul) / 2,
          paintSize * Math.sqrt(xmul * ymul),
          0,
          2 * Math.PI
        );
        ctx.arc(
          currX * xmul,
          currY * ymul,
          paintSize * Math.sqrt(xmul * ymul),
          0,
          2 * Math.PI
        );
        ctx.fill();
        is_something_drawn = true;
      }
    }
  };

  useEffect(() => {
    const canvas = document.getElementById(canvasImgId) as HTMLCanvasElement;
    const canvasD = document.getElementById(canvasDrawId) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const ctxD = canvasD.getContext("2d")!;

    addImageProcess("/img.png").then((img: HTMLImageElement) => {
      canvasD.height = img.height;
      canvasD.width = img.width;
      canvas.height = img.height;
      canvas.width = img.width;

      canvasRef.current = canvas;
      ctxRef.current = ctx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctxD.clearRect(0, 0, canvasD.width, canvasD.height);
      ctxD.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvasD.width,
        canvasD.height
      );

      clearInpaint();
      setIsReady(true);
    });
  }, [clearInpaint]);

  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    const onMouseDown = (e: any) => findXy("down", e);
    const onMouseUp = (e: any) => findXy("up", e);
    const onMouseOut = (e: any) => findXy("out", e);
    const onMouseMove = (e: any) => findXy("move", e);

    canvasRef.current.addEventListener("mousedown", onMouseDown, false);
    canvasRef.current.addEventListener("mouseup", onMouseUp, false);
    canvasRef.current.addEventListener("mouseout", onMouseOut, false);
    canvasRef.current.addEventListener("mousemove", onMouseMove, false);

    return () => {
      if (!canvasRef.current) return;

      canvasRef.current.removeEventListener("mousedown", onMouseDown, false);
      canvasRef.current.removeEventListener("mouseup", onMouseUp, false);
      canvasRef.current.removeEventListener("mouseout", onMouseOut, false);
      canvasRef.current.removeEventListener("mousemove", onMouseMove, false);
    };
  }, [isReady, paintSize]);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "850px",
          width: "100%",
          height: "100%",
          maxHeight: "450px",
        }}
      >
        <canvas
          id={canvasImgId}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <canvas
          id={canvasDrawId}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
      <div className="flex mt-4">
        <input
          type="range"
          min={20}
          max={50}
          value={paintSize}
          onChange={(e) => setPaintSize(+e.target.value)}
        />
        <span>Paint size: {paintSize}</span>
      </div>
      <div className="mt-4 flex gap-4">
        <div>
          <button className="border py-2 px-4" onClick={clearInpaint}>
            Clear
          </button>
        </div>
        <div>
          <button
            className={`border py-2 px-4 ${
              isErase ? "border-red-500 text-red-500" : ""
            }`}
            onClick={toggleErase}
          >
            Erase
          </button>
        </div>
      </div>
    </main>
  );
}

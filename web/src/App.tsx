import { useEffect, useRef, useState } from "react";
import { useMove } from "@react-aria/interactions";

const WS_URL = "ws://100.74.215.11:3000/ws";
// const WS_URL = "ws://localhost:8765";
// const WS_URL = "ws://172.58.32.121:8765";

const Slider: React.FC<{
  setValue: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}> = ({ setValue, min, max }) => {
  const CONTROLLER_SIZE = 56;
  let containerRef = useRef<HTMLDivElement>(null);
  let [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  function toRealValue(pos: number) {
    if (!containerRef.current) {
      return 0;
    }
    const relativeValue = Math.max(
      -containerRef.current.clientHeight + CONTROLLER_SIZE,
      Math.min(pos, 0)
    );
    const realValue =
      (-relativeValue / (containerRef.current.clientHeight - CONTROLLER_SIZE)) *
      (max - min);
    return realValue;
  }

  useEffect(() => {
    if (containerRef.current) {
      setValue(toRealValue(position.y));
    }
  }, [position, containerRef]);

  const clamp = (pos: number) => {
    if (!containerRef.current) {
      return 0;
    }
    return Math.max(
      -containerRef.current.clientHeight + CONTROLLER_SIZE,
      Math.min(pos, 0)
    );
  };

  let { moveProps } = useMove({
    onMove(e) {
      setPosition(({ x, y }) => {
        if (e.pointerType === "keyboard") {
          x = clamp(x);
          y = clamp(y);
        }

        x += e.deltaX;
        y += e.deltaY;
        return { x, y };
      });
    },
  });

  return (
    <div
      className="bg-[rgb(24,24,24)] h-9/10 w-12 border-4 border-[rgb(213,213,213)] transform -translate-x-5 relative rounded-md"
      onContextMenu={(e) => e.preventDefault()}
      ref={containerRef}
      style={{ touchAction: "none" }}
    >
      <div
        className="absolute bg-[rgb(195,42,30)] w-18 h-14 rounded-full bottom-0"
        style={{ transform: `translate(-16px,${clamp(position.y)}px)` }}
        tabIndex={0}
        {...moveProps}
      ></div>
    </div>
  );
};

function App() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const websocket = useRef<WebSocket>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    websocket.current = new WebSocket(WS_URL);
  }, []);

  useEffect(() => {
    const event = { type: "set_pwm", left, right };
    console.log(event);
    if (websocket.current?.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(event));
    }
  }, [left, right]);

  function handleClick() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div
      className="bg-black w-screen h-screen grid place-items-center select-none"
      ref={containerRef}
    >
      <div className="p-6 pt-12 bg-[rgb(213,213,213)] h-full w-full max-h-[375px] max-w-[900px] mx-auto portrait:hidden">
        <div className=" bg-[rgb(24,24,24)] h-full grid grid-cols-3 rounded-md relative">
          <div className="flex items-center justify-center">
            <Slider setValue={setLeft} min={0} max={100} />
          </div>
          <div className="grid grid-rows-6 grid-cols-1 items-center gap-y-3">
            <div className="bg-[rgb(164,164,164)] w-full rounded-b-lg h-full flex"></div>
            <div className="bg-[rgb(164,164,164)] w-full rounded-lg h-full flex"></div>
            <div className="bg-[rgb(164,164,164)] w-full rounded-lg h-full flex items-center justify-center text-[rgb(195,42,30)] space-x-10 tracking-wider text-sm">
              <div>SELECT</div>
              <div>START</div>
            </div>
            <div className="bg-[rgb(196,196,196)] row-span-2 w-full rounded-lg h-full flex items-center justify-around">
              <div className="rounded-2xl bg-[rgb(82,82,82)] h-6 w-1/3 shadow-xl border border-[rgb(24,24,24)]"></div>
              <button
                onClick={handleClick}
                className="rounded-2xl bg-[rgb(82,82,82)] h-6 w-1/3 shadow-xl border border-[rgb(24,24,24)]"
              ></button>
            </div>
            <div className="bg-[rgb(164,164,164)] w-full rounded-t-lg h-full flex"></div>
          </div>

          <div className="flex items-center justify-center">
            <Slider setValue={setRight} min={0} max={100} />
          </div>
          <h1 className="text-[rgb(195,42,30)] font-pretendo text-3xl font-bold tracking-tracking-wider absolute transform rotate-90 origin-bottom-left -right-20">
            Sixteen
          </h1>
        </div>
      </div>
      <input
        hidden
        type="range"
        min={0}
        max={100}
        step={1}
        value={left}
        onInput={(e) => setLeft(+e.currentTarget.value)}
      />
      <input
        hidden
        type="range"
        min={0}
        max={100}
        step={1}
        value={right}
        onInput={(e) => setRight(+e.currentTarget.value)}
      />
      <div className="landscape:hidden text-2xl tracking-wide p-8">
        Pls use landscape
      </div>
    </div>
  );
}

export default App;

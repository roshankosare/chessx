import React, { useState } from "react";
import { Button } from "../ui/button";

interface SelectTimeProps {
  time: number;
  setTime: (time: number) => void;
}
const SelectTime: React.FC<SelectTimeProps> = ({ time, setTime }) => {
  const [showTimeOption, setShowTimeOption] = useState<boolean>(false);
  return (
    <div className="max-w-[300px] w-full h-auto">
      <Button
        className="  w-full h-[60px] rounded-md flex justify-center gap-x-2"
        onClick={() => setShowTimeOption((pre) => !pre)}
      >
        {time === 1 ? (
          <img src="/bullet.svg" className="h-6 w-6" />
        ) : time === 3 ? (
          <img src="/thunder.svg" className="h-6 w-6" />
        ) : time == 5 ? (
          <img src="/clock.svg" className="h-6 w-6 filter hue-rotate-[90deg]" />
        ) : (
          <img src="/clock.svg" className="h-6 w-6" />
        )}
        <p className="sm:text-2xl text-xl sm:font-extrabold font-bold">
          {time} min
        </p>
      </Button>

      {showTimeOption && (
        <div
          className=" flex flex-wrap justify-around w-full h-auto gap-x-4 px-2 py-4 gap-y-4"
        >
          <Button
            className="bg-zinc-900 text-white px-4 p-2 w-28 h-10 flex justify-center gap-x-2"
            onClick={() => {
              setShowTimeOption(false);
              setTime(1);
            }}
          >
            <img src="/bullet.svg" className="h-5 w-5" />1 min
          </Button>
          <Button
            className="bg-zinc-900 text-white px-4 p-2 w-28 h-10 flex justify-center gap-x-2"
            onClick={() => {
              setShowTimeOption(false);
              setTime(3);
            }}
          >
            <img src="/thunder.svg" className="h-5 w-5" />3 min
          </Button>
          <Button
            className="bg-zinc-900 text-white px-4 p-2 w-28 h-10 flex justify-center gap-x-2"
            onClick={() => {
              setShowTimeOption(false);
              setTime(5);
            }}
          >
            <img
              src="/clock.svg"
              className="h-5 w-5 filter hue-rotate-[90deg]"
            />
            5 min
          </Button>
          <Button
            className="bg-zinc-900 text-white px-4 p-2 w-28 h-10 justify-center gap-x-2"
            onClick={() => {
              setShowTimeOption(false);
              setTime(10);
            }}
          >
            <img src="/clock.svg" className="h-5 w-5  " />
            10 min
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectTime;

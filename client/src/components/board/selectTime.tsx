import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

interface SelectTimeProps {
  time: number;
  setTime: (time: number) => void;
}
const SelectTime: React.FC<SelectTimeProps> = ({ time, setTime }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="  w-full h-[60px] rounded-md  ">
            <p className="sm:text-2xl text-xl sm:font-extrabold font-bold">
              {" "}
              {time} min
            </p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Game time</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTime(1)}>1 min</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTime(3)}>3 min</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTime(5)}>5 min</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTime(10)}>
            10 min
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectTime;

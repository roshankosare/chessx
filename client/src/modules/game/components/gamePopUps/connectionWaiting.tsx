import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

type ConnectionWaitingProps = {
  open: boolean;
};
const ConnectionWaiting: React.FC<ConnectionWaitingProps> = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]  flex flex-col gap-y-10 px-0 py-0 border-0 bg-neutral-800">
        <DialogHeader className=" px-2 py-2 bg-neutral-950  ">
          <DialogTitle className="font-bold  text-xl sm:text-2xl text-center text-white">
            Connecting..
          </DialogTitle>
          <DialogDescription className=" text-md sm:text-lg text-center ">
            This can take few minutes based on server availability.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionWaiting;

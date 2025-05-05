import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Message from "@/types/message.model";

function MessageTextLeft({ message }: { message: Message }) {
  return (
      <div className="flex items-center ">
        <Avatar className="w-12 h-7 self-end flex items-center justify-center">
          <AvatarImage className="w-7 h-7" src="/placeholder.svg" />
          <AvatarFallback className="w-7 h-7 self-center">T</AvatarFallback>
        </Avatar>

        <div className=" rounded-[18px] border-solid pl-3 pr-3 pt-2 pb-2 
         items-center max-w-[80%] bg-[#F0F0F0] break-words ">
          <p className="text-[15px] text-normal text-[rgb(5, 5, 5)]">
            {message.content}
          </p>
        </div>
    </div>
  );
}
export default React.memo(MessageTextLeft);

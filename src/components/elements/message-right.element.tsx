import Message from "@/types/message.model";
import React from "react";

function MessageRight({ message }: { message: Message }) {
  return (
    <div className="flex justify-end ">
      <div
        className="bg-[#0084ff] text-white rounded-2xl p-2 
      break-words max-w-[80%] "
      >
        <p className="text-[15px] text-normal text-white">{message.content}</p>
      </div>
    </div>
  );
}

export default React.memo(MessageRight);

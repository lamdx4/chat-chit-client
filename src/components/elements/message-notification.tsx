import React from "react";
import Message from "@/types/message.model";
import TemplateMessage from "./mention.element";

function MessageNotificationText({ message }: { message: Message }) {
  return (
    <div className="flex items-center justify-center ">
      <div
        className=" rounded-[18px] border-solid pl-3 pr-3 pt-2 pb-2 
         items-center max-w-[80%]  break-words "
      >
        <p className="text-[13px] text-gray-500 text-normal text-[rgb(5, 5, 5)]">
          {((messageData: Message) => {
            console.log("messageData", messageData);
            if (message.manipulateMembers.length > 0) {
              return (
                <TemplateMessage
                  mentions={messageData.manipulateMembers}
                  template={message.content}
                />
              );
            }
          })(message)}
        </p>
      </div>
    </div>
  );
}
export default React.memo(MessageNotificationText);

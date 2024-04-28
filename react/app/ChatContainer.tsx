import classNames from "classnames";
import { FormEvent, useEffect, useState } from "react";
import Socket from "socket.io-client";

type Chat = {
  userId: string;
  text: string;
};

const ChatContiner = ({ socket }: { socket: ReturnType<typeof Socket> }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [msg, setMsg] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: Chat = {
      userId: socket.id!,
      text: msg,
    };
    console.log(payload);
    socket.emit("send", payload);
    setMsg("");
  };

  useEffect(() => {
    socket.on("receive", (data: Chat) => setChats([...chats, data]));
    socket.on("history", (data: Chat[]) => setChats(data));

    const bottom = document.getElementById("chat_bottom");
    bottom?.scrollIntoView({ behavior: "smooth" });

    return () => {
      // prevent duplicate event registration
      socket.off("receive");
      socket.off("history");
    };
  }, [chats]);

  return (
    <div className="flex w-2/4 overflow-hidden flex-col rounded-md border border-black bg-slate-100">
      <section className="w-full h-80 overflow-scroll">
        <div className="flex flex-col">
          {chats.map((chat, index) => (
            <div
              key={index}
              className={classNames("p-2", {
                "self-end": chat.userId === socket.id,
              })}
            >
              <span className="text-gray-600 text-sm">
                {chat.userId === socket.id ? "you" : chat.userId}
              </span>
              <p className="text-white bg-blue-500 py-2 px-4 rounded-md w-fit">
                {chat.text}
              </p>
            </div>
          ))}
          <span id="chat_bottom"></span>
        </div>
      </section>

      <form
        className="space-x-4 h-fit flex items-center bg-gray-200 p-2"
        onSubmit={onSubmit}
      >
        <input
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="rounded-md grow p-4"
          placeholder="message..."
        />
        <button className="bg-blue-600 px-6 py-2 text-white rounded-md border-none">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatContiner;

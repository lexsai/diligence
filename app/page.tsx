"use client"
import { KeyboardEvent, useRef, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { ChannelContext } from "./_contexts/channel-context";
import Channel from "./_components/channel";

interface Message {
  channel: string,
  time_sent: number,
  content: string,
}

export interface ChannelState {
  name: string,
  hasSynced: boolean,
}

export default function Home() {
  const [channels, setChannels] = useState<ChannelState[]>([
    {
      name: "channel 01",
      hasSynced: false
    },
    {
      name: "channel 02",
      hasSynced: false
    },
    {
      name: "channel 03",
      hasSynced: false
    }
  ]);

  const [chosenChannel, setChosenChannel] = useState(channels[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  const inputRef = useRef<HTMLInputElement>(null!);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const messageContent = inputRef.current.value;

      invoke("write_command", { 
        channel: chosenChannel.name,
        timeSent: Date.now(),
        message: messageContent,
      });

      const newMessage: Message = { channel: chosenChannel.name, time_sent: Date.now(), content: messageContent };
      setMessages([...messages, newMessage]);
      setCurrentMessages([...currentMessages, newMessage]);
      inputRef.current.value = "";
    }
  }
  
  function handleChannelClick(newChannel: ChannelState) {
    setChosenChannel(newChannel);

    console.log("hmm", newChannel);

    if (!newChannel.hasSynced) {
      // @ts-ignore
      invoke("history_command", { channel: newChannel.name }).then((results: Message[]) => {
        console.log(results)
        newChannel.hasSynced = true;
        setMessages([...messages, ...results]);
        setCurrentMessages(results);
      });
    } else {    
      setCurrentMessages(messages.filter(m => m.channel === newChannel.name));
    }
  }

  return (
    <div className="flex bg-black h-screen max-h-screen">
      <div className="flex-none flex-col w-72 bg-zinc-200">
        <div className="h-10 border-b-2 border-black mb-4"></div>
        <ChannelContext.Provider value={chosenChannel}>
          {channels.map(function(state, _i){
            return <Channel key={state.name} state={state} onClick={handleChannelClick} />
          })}
        </ChannelContext.Provider>
      </div>
      <div className="flex-1 flex flex-grow flex-col bg-white justify-center border-r-2 border-black">
          <div className="flex-none font-mono h-10 p-2 text-xl border-b-2 border-black">
            <div className="inline p-2 font-mono text-xl">#</div>{chosenChannel.name}
          </div>
          <div className="flex-1 h-3xl mx-5 overflow-y-scroll">
            {currentMessages.map(function(message, _i){
              return <div key={message.content + message.time_sent} className="font-mono bg-zinc-100 max-w-3xl p-2 m-2">{message.content}</div>
            })}
          </div>
          <div className="flex-none mx-5">
            <input ref={inputRef} className="bg-zinc-200 p-1 mb-2 w-full" onKeyDown={handleKeyDown}></input>
          </div>
      </div>
      <div className="flex-none flex-col min-w-72 bg-white">
        <div className="h-10 border-b-2 border-black mb-4"></div>
      </div>
    </div>
  );
}

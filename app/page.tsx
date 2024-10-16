"use client"
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { ChannelContext } from "./_contexts/channel-context";
import Channel from "./_components/channel";

interface Message {
  channel: string,
  timeSent: number,
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

  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    invoke("history_command", { channel: chosenChannel.name }).then(
      // @ts-ignore
      (results: Message[]) => {
        setMessages(results);
      }
    );
  }, [chosenChannel])

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const messageContent = inputRef.current.value;

      invoke("write_command", { 
        channel: chosenChannel.name,
        timeSent: Date.now(),
        content: messageContent,
      }).then(() => {
        invoke("history_command", { channel: chosenChannel.name }).then(
          // @ts-ignore
          (results: Message[]) => {
            setMessages(results);
          }
        );
      });

      inputRef.current.value = "";
    }
  }
  
  function handleChannelClick(newChannel: ChannelState) {
    setChosenChannel(newChannel);
    invoke("history_command", { channel: newChannel.name }).then(
      // @ts-ignore
      (results: Message[]) => {
        setMessages(results);
        console.log(results);
      }
    );
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
            {messages.map(function(message, _i){
              return <div key={message.content + message.timeSent} className="font-mono bg-zinc-100 max-w-3xl p-2 m-2">{message.content}</div>
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

"use client"
import { KeyboardEvent, useRef, useState } from "react";
import { ChannelContext } from "./_contexts/channel-context";
import Channel from "./_components/channel";

const channels: string[] = [
  "channel 01",
  "channel 02",
  "channel 03"
]

const messages: string[] = [
  "It must, however, be confessed, that this species of scepticism, when more moderate, may be understood in a very reasonable sense, and is a necessary preparative to the study of philosophy, by preserving a proper impartiality in our judgments, and weaning our mind from all those prejudices, which we may have imbibed from education or rash opinion.",
  "To begin with clear and self-evident principles, to advance by timorous and sure steps, to review frequently our conclusions, and examine accurately all their consequences; though by these means we shall make both a slow and a short progress in our systems; are the only methods, by which we can ever hope to reach truth, and attain a proper stability and certainty in our determinations.",
  "There is another species of scepticism, consequent to science and enquiry, when men are supposed to have discovered, either the absolute fallaciousness of their mental faculties, or their unfitness to reach any fixed determination in all those curious subjects of speculation, about which they are commonly employed.",
  "Even our very senses are brought into dispute, by a certain species of philosophers; and the maxims of common life are subjected to the same doubt as the most profound principles or conclusions of metaphysics and theology. As these paradoxical tenets (if they may be called tenets) are to be met with in some philosophers, and the refutation of them in several, they naturally excite our curiosity, and make us enquire into the arguments, on which they may be founded.",
  "test",
]

export default function Home() {
  const [chosenChannel, setChosenChannel] = useState(channels[0]);
  const inputRef = useRef(null);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // @ts-ignore
      inputRef.current.value = "";
    }
  }

  return (
    <div className="flex bg-black h-screen max-h-screen">
      <div className="flex-none flex-col w-72 bg-zinc-200">
        <div className="h-10 border-b-2 border-black mb-4"></div>
        <ChannelContext.Provider value={chosenChannel}>
          {channels.map(function(name, _i){
            return <Channel key={name} name={name} onClick={setChosenChannel} />
          })}
        </ChannelContext.Provider>
      </div>
      <div className="flex-1 flex flex-grow flex-col bg-white justify-center border-r-2 border-black">
          <div className="flex-none font-mono h-10 p-2 text-xl border-b-2 border-black">
            <div className="inline p-2 font-mono text-xl">#</div>{chosenChannel}
          </div>
          <div className="flex-1 h-3xl mx-5 overflow-y-scroll">
            {messages.map(function(message, _i){
              return <div key={message} className="font-mono bg-zinc-100 p-2 m-2">{message}</div>
            })}
          </div>
          <div className="flex-none mx-5">
            <input ref={inputRef} className="bg-zinc-200 p-1 mb-4 w-full" onKeyDown={handleKeyDown}></input>
          </div>
      </div>
      <div className="flex-none flex-col min-w-72 bg-white">
        <div className="h-10 border-b-2 border-black mb-4"></div>
      </div>
    </div>
  );
}

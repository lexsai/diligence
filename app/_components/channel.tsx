"use client"
import { useContext } from "react"
import { ChannelContext } from "../_contexts/channel-context";
import { ChannelState } from "../page";

interface IChannelProps {
  state: ChannelState;
  onClick: Function
}

export default function Channel({ state, onClick } : IChannelProps) {
  const chosenChannel = useContext(ChannelContext); 
  
  if (state.name === chosenChannel.name) {
    return <div 
              key={state.name} 
              className="font-mono bg-zinc-400 text-black" 
              onClick={() => onClick(state)}>
              <div className="inline p-2 font-mono text-xl">#</div>{state.name}
            </div>
  } else {
    return <div 
              key={state.name} 
              className="font-mono hover:bg-zinc-300 text-zinc-500" 
              onClick={() => onClick(state)}>
              <div className="inline p-2 font-mono text-xl">#</div>{state.name}
            </div>  
  }
}
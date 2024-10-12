"use client"
import { useContext } from "react"
import { ChannelContext } from "../_contexts/channel-context";

interface IChannelProps {
  name: string;
  onClick: Function
}

export default function Channel({ name, onClick } : IChannelProps) {
  const chosenChannel = useContext(ChannelContext); 
  
  if (name === chosenChannel) {
    return <div 
              key={name} 
              className="font-mono bg-zinc-400 text-black" 
              onClick={() => onClick(name)}>
              <div className="inline p-2 font-mono text-xl">#</div>{name}
            </div>
  } else {
    return <div 
              key={name} 
              className="font-mono hover:bg-zinc-300 text-zinc-500" 
              onClick={() => onClick(name)}>
              <div className="inline p-2 font-mono text-xl">#</div>{name}
            </div>  
  }
}
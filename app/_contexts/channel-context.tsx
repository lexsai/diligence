import { createContext } from "react";
import { ChannelState } from "../page";

export const ChannelContext = createContext<ChannelState>({
  name: "",
  hasSynced: true,
});

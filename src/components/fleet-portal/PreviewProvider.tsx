"use client";
import {
  createContext,
  Fragment,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  initialPreview,
  runCommand,
  type PreviewState,
  type PreviewCommand,
  type CommandResult,
  type Market,
} from "@/lib/fleet-preview-domain";

// Service boundary: future production adapters must provide authoritative reads,
// scoped writes, versions and typed errors. This adapter never performs I/O.
import {
  createPreviewServices,
  type FleetServices,
} from "@/lib/fleet-preview-services";
export interface FleetPreviewService {
  hasDraft: boolean;
  setHasDraft(value: boolean): void;
  services(): FleetServices;
  state: PreviewState;
  execute(command: PreviewCommand): CommandResult;
  setMarket(market: Market): void;
  setRole(role: PreviewState["role"]): void;
  reset(): void;
}
const PreviewContext = createContext<FleetPreviewService | null>(null);
export function PreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialPreview);
  const [hasDraft, setHasDraft] = useState(false);
  const [generation, setGeneration] = useState(0);
  const current = useRef(state);
  function commit(next: PreviewState) {
    current.current = next;
    setState(next);
  }
  const execute = (command: PreviewCommand) => {
    const result = runCommand(current.current, command);
    if (result.ok) commit(result.state);
    return result;
  };
  const service: FleetPreviewService = {
    hasDraft,
    setHasDraft,
    state,
    services() {
      return createPreviewServices(() => current.current, execute);
    },
    execute,
    setMarket(market) {
      commit({ ...current.current, market });
    },
    setRole(role) {
      commit({ ...current.current, role });
    },
    reset() {
      commit(initialPreview());
      setGeneration((value) => value + 1);
    },
  };
  return (
    <PreviewContext.Provider value={service}>
      <Fragment key={generation}>{children}</Fragment>
    </PreviewContext.Provider>
  );
}
export function usePreview() {
  const service = useContext(PreviewContext);
  if (!service) throw new Error("PreviewProvider is required");
  return service;
}

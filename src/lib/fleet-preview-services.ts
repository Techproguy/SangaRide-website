import type {
  Collection,
  PreviewRecord,
  PreviewCommand,
  CommandResult,
  Market,
  PreviewState,
} from "./fleet-preview-domain";
// No production URLs or fake authentication. Implement these boundaries against
// approved services before enabling operational access.
export type ServiceError = {
  code:
    | "unavailable"
    | "unauthorized"
    | "conflict"
    | "not_found"
    | "validation";
  message: string;
  correlationId?: string;
};
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ServiceError };
export interface ScopedRecords {
  list(
    collection: Collection,
    market: Market,
  ): Promise<ServiceResult<PreviewRecord[]>>;
  get(
    collection: Collection,
    id: string,
    market: Market,
  ): Promise<ServiceResult<PreviewRecord>>;
  mutate(command: PreviewCommand): Promise<CommandResult>;
}
export interface FleetServices {
  identity: {
    session(): Promise<
      ServiceResult<{ userId: string; permissions: string[] }>
    >;
    recover(): Promise<ServiceResult<never>>;
  };
  onboarding: ScopedRecords;
  supply: ScopedRecords;
  operations: ScopedRecords;
  finance: ScopedRecords;
  team: ScopedRecords;
  support: ScopedRecords;
  reports: ScopedRecords;
  notifications: ScopedRecords;
  audit: ScopedRecords;
}
export const unavailableService = {
  ok: false,
  error: {
    code: "unavailable",
    message: "Not connected. This preview cannot perform a production action.",
  },
} as const;
export function createPreviewServices(
  read: () => PreviewState,
  execute: (command: PreviewCommand) => CommandResult,
): FleetServices {
  function scoped(allowed: Collection[]): ScopedRecords {
    return {
      async list(collection, market) {
        const state = read();
        if (
          market !== state.market ||
          !allowed.includes(collection) ||
          (collection === "requests" && state.role === "Operations")
        )
          return {
            ok: false,
            error: {
              code: "unauthorized",
              message: "Record scope is unavailable in this preview.",
            },
          };
        return {
          ok: true,
          data: structuredClone(
            state.records[collection].filter((r) => r.market === market),
          ),
        };
      },
      async get(collection, id, market) {
        const list = await this.list(collection, market);
        if (!list.ok) return list;
        const record = list.data.find((r) => r.id === id);
        return record
          ? { ok: true, data: record }
          : {
              ok: false,
              error: { code: "not_found", message: "Sample record not found." },
            };
      },
      async mutate(command) {
        return allowed.includes(command.collection)
          ? execute(command)
          : {
              ok: false,
              error: "This preview adapter cannot mutate that collection.",
            };
      },
    };
  }
  return {
    identity: {
      async session() {
        return unavailableService;
      },
      async recover() {
        return unavailableService;
      },
    },
    onboarding: scoped(["applications"]),
    supply: scoped(["drivers", "vehicles", "invitations"]),
    operations: scoped(["assignments"]),
    finance: scoped(["requests"]),
    team: scoped(["team", "invitations"]),
    support: scoped(["tickets"]),
    reports: scoped(["reports"]),
    notifications: scoped(["notifications"]),
    audit: {
      ...scoped([]),
      async list(_collection, market) {
        return market === read().market
          ? {
              ok: true,
              data: structuredClone(
                read().audit.filter((r) => r.market === market),
              ),
            }
          : {
              ok: false,
              error: {
                code: "unauthorized",
                message: "Market not permitted in preview.",
              },
            };
      },
      async mutate() {
        return {
          ok: false,
          error: "Audit entries are append-only in the preview.",
        };
      },
    },
  };
}

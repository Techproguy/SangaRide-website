import test from "node:test";
import assert from "node:assert/strict";
import { createPreviewServices } from "../src/lib/fleet-preview-services.ts";

test("preview service adapters scope reads, return copies and expose no live identity", async () => {
  let state = initialPreview();
  const services = createPreviewServices(
    () => state,
    (command) => {
      const result = runCommand(state, command);
      if (result.ok) state = result.state;
      return result;
    },
  );
  const rows = await services.supply.list("drivers", "NG");
  assert(rows.ok);
  assert(rows.data.every((r) => r.market === "NG"));
  rows.data[0].name = "Mutated copy";
  assert.notEqual(state.records.drivers[0].name, "Mutated copy");
  assert.equal(
    (await services.supply.get("drivers", "daniel", "NG")).ok,
    false,
  );
  assert.equal((await services.supply.list("drivers", "US")).ok, false);
  assert.equal((await services.identity.session()).ok, false);
  assert.equal(
    (
      await services.audit.mutate({
        kind: "create",
        collection: "drivers",
        name: "Forbidden",
        fields: {},
      })
    ).ok,
    false,
  );
  state.role = "Operations";
  assert.equal((await services.finance.list("requests", "NG")).ok, false);
  assert.equal(
    runCommand(state, {
      kind: "create",
      collection: "invitations",
      name: "Team access",
      fields: { invitationType: "team" },
    }).ok,
    false,
  );
});
import {
  initialPreview,
  runCommand,
  allocation,
  assignmentErrors,
  remittance,
  formatMoney,
} from "../src/lib/fleet-preview-domain.ts";
import {
  isRecordPath,
  workflowRoutes,
} from "../src/lib/fleet-preview-routes.ts";

function transition(state, collection, id, status, fields = {}) {
  const r = state.records[collection].find((r) => r.id === id);
  return runCommand(state, {
    kind: "transition",
    collection,
    id,
    status,
    version: r.version,
    reason: "Test preview reason",
    fields,
  });
}
test("commission-first allocations reconcile for NGN/USD examples and minor-unit rounding", () => {
  for (const gross of [0, 1, 99, 1000000, 999999]) {
    const x = allocation(gross, 1500, 2000);
    assert.equal(x.gross, x.sanga + x.fleet + x.driver);
    assert.equal(x.net, x.fleet + x.driver);
    assert.equal(x.fleet, Math.round(x.net * 0.2));
  }
  assert.match(formatMoney(1000000, "NG"), /10,000/);
  assert.match(formatMoney(1000000, "US"), /10,000/);
  assert.throws(() => allocation(1.5, 1500, 2000));
  assert.throws(() => allocation(100, 10001, 2000));
});
test("cash partial remittance remains outstanding; overpayment and duplicates fail", () => {
  assert.equal(remittance(150000, 50000), 100000);
  assert.throws(() => remittance(100000, 150000));
  assert.throws(() => remittance(0, 50000));
  assert.throws(() => remittance(100, 0));
});
test("expired, rejected and revoked invitation states cannot accept directly", () => {
  const s = initialPreview();
  assert.equal(
    transition(s, "invitations", "inv-expired", "accepted").ok,
    false,
  );
  const revoked = transition(s, "invitations", "inv-001", "revoked");
  assert(revoked.ok);
  assert.equal(
    transition(revoked.state, "invitations", "inv-001", "accepted").ok,
    false,
  );
});
test("driver invitation acceptance creates an unverified driver and audit event", () => {
  const r = transition(initialPreview(), "invitations", "inv-001", "accepted");
  assert(r.ok);
  const driver = r.state.records.drivers.find((r) => r.id === "driver-inv-001");
  assert.equal(driver.status, "verification_pending");
  assert(r.state.audit[0].fields.correlationId);
});
test("team invitation acceptance is unavailable without identity", () => {
  let s = initialPreview();
  s.records.invitations[0].fields.invitationType = "team";
  assert.equal(transition(s, "invitations", "inv-001", "accepted").ok, false);
});
test("critical maintenance and expired evidence block assignment", () => {
  const s = initialPreview();
  assert(
    assignmentErrors(s, "chinedu", "rav4").some((e) =>
      e.includes("maintenance"),
    ),
  );
  assert(assignmentErrors(s, "aisha", "corolla").length >= 2);
  const r = runCommand(s, {
    kind: "create",
    collection: "assignments",
    name: "Invalid assignment",
    fields: { driver: "chinedu", vehicle: "rav4" },
  });
  assert.equal(r.ok, false);
});
test("resolve maintenance then assign; overlap conflicts and suspension are blocked", () => {
  let s = initialPreview();
  for (const status of [
    "triaged",
    "in_progress",
    "resolution_submitted",
    "resolved",
  ]) {
    const r = transition(s, "issues", "iss-2711", status);
    assert(r.ok);
    s = r.state;
  }
  let r = runCommand(s, {
    kind: "create",
    collection: "assignments",
    name: "Sample assignment",
    fields: { driver: "chinedu", vehicle: "rav4" },
  });
  assert(r.ok);
  s = r.state;
  assert(
    assignmentErrors(s, "chinedu", "rav4").some((e) =>
      e.includes("active assignment"),
    ),
  );
  assert.equal(transition(s, "vehicles", "rav4", "suspended").ok, false);
  assert.equal(transition(s, "drivers", "chinedu", "suspended").ok, false);
});
test("resolving maintenance does not clear independent document expiry", () => {
  let s = initialPreview();
  s.records.vehicles[0].fields.documents = "expired";
  s.records.issues[0].status = "resolved";
  assert(
    assignmentErrors(s, "chinedu", "rav4").some((e) =>
      e.includes("valid documents"),
    ),
  );
});
test("stale versions fail without mutation or audit", () => {
  const s = initialPreview();
  const r = runCommand(s, {
    kind: "transition",
    collection: "vehicles",
    id: "rav4",
    version: 99,
    status: "suspended",
    reason: "stale",
  });
  assert.equal(r.ok, false);
  assert.equal(s.records.vehicles[0].status, "active");
  assert.equal(s.audit.length, 0);
});
test("last owner removal/demotion is rejected; promote then transfer preserves owner", () => {
  const s = initialPreview();
  assert.equal(transition(s, "team", "samuel", "revoked").ok, false);
  assert.equal(
    transition(s, "team", "samuel", "active", { role: "Operations" }).ok,
    false,
  );
  let r = transition(s, "team", "aisha", "active", { role: "Owner" });
  assert(r.ok);
  r = transition(r.state, "team", "samuel", "active", { role: "Operations" });
  assert(r.ok);
  assert.equal(
    r.state.records.team.filter(
      (r) =>
        r.market === "NG" && r.status === "active" && r.fields.role === "Owner",
    ).length,
    1,
  );
});
test("preview roles and cross-market reads/writes cannot bypass scoped rules", () => {
  const s = initialPreview();
  s.role = "Read-only";
  assert.equal(transition(s, "vehicles", "rav4", "suspended").ok, false);
  s.role = "Operations";
  assert.equal(transition(s, "team", "aisha", "suspended").ok, false);
  s.role = "Owner";
  s.market = "US";
  assert.equal(transition(s, "drivers", "chinedu", "suspended").ok, false);
  assert.equal(assignmentErrors(s, "chinedu", "rav4").length, 2);
});
test("request approval never modifies historical sample allocation", () => {
  const s = initialPreview();
  const before = allocation(1000000, 1500, 2000);
  let r = runCommand(s, {
    kind: "create",
    collection: "requests",
    name: "Split change",
    fields: { fleet: "30", driver: "70", effective: "2026-11-15" },
  });
  assert(r.ok);
  r = transition(r.state, "requests", r.id, "approved");
  assert(r.ok);
  assert.deepEqual(allocation(1000000, 1500, 2000), before);
});
test("new records and references are unique and reset creates a fresh isolated store", () => {
  const s = initialPreview();
  const r = runCommand(s, {
    kind: "create",
    collection: "tickets",
    name: "Test sample",
    fields: { message: "Preview only" },
  });
  assert(r.ok);
  assert.equal(s.records.tickets.length, 1);
  assert.equal(r.state.records.tickets.length, 2);
  assert.equal(initialPreview().records.tickets.length, 1);
  assert.notEqual(r.id, r.state.audit[0].id);
});
test("record routes preserve aliases, accept new records and reject unknown records", () => {
  assert(isRecordPath("vehicles/rav4/documents"));
  assert(isRecordPath("drivers/chinedu/verification"));
  assert(isRecordPath("drivers/preview-1"));
  assert(!isRecordPath("drivers/not-a-driver"));
  assert(!isRecordPath("vehicles/rav4/not-a-tab"));
  assert(!isRecordPath("../drivers/chinedu"));
  assert(workflowRoutes.includes("onboarding/review"));
});

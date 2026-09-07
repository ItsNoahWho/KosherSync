// The command table.
//
// One entry per command, and it is the single source of truth: dispatch, help,
// and the agent-facing registry are all derived from this. There is no second
// list to keep in sync — the thing Ro Sync's docs-only registry got wrong.
//
// `positional` binds bare arguments to op args; anything else arrives as a flag.

export const COMMANDS = {
  // ---------------------------------------------------------- navigation
  get: {
    op: "get",
    group: "Navigate",
    summary: "Read an instance, or one property of it",
    positional: { required: ["path"], optional: ["prop"] },
    examples: ["ksync get Workspace/Camera", "ksync get Workspace/Camera FieldOfView"],
  },
  ls: {
    op: "ls",
    group: "Navigate",
    summary: "List the children of an instance",
    positional: { optional: ["path"] },
    examples: ["ksync ls", "ksync ls ReplicatedStorage"],
  },
  tree: {
    op: "tree",
    group: "Navigate",
    summary: "Print a subtree",
    positional: { optional: ["path"] },
    flags: { depth: "how deep to descend (default 3)" },
    examples: ["ksync tree Workspace --depth 2"],
  },
  props: {
    op: "props",
    group: "Navigate",
    summary: "Print an instance's readable properties",
    positional: { required: ["path"] },
    examples: ["ksync props Workspace/Baseplate"],
  },
  source: {
    op: "source",
    group: "Navigate",
    summary: "Print a script's source — for unsynced places and unsaved drafts",
    flags: { force: "read through Studio even when the place is synced" },
    positional: { required: ["path"] },
    examples: ["ksync source ReplicatedStorage/Config"],
  },
  query: {
    op: "query",
    group: "Navigate",
    summary: "Match a selector against the live tree",
    positional: { required: ["selector"] },
    flags: { class: "only instances of this class", props: "comma-separated properties to include" },
    examples: ["ksync query 'StarterGui/**/TextButton'", "ksync query 'Workspace/*' --class Model"],
  },
  find: {
    op: "find",
    group: "Navigate",
    summary: "Find descendants by class and/or name",
    flags: { class: "class name", name: "name substring", under: "restrict to a subtree" },
    examples: ["ksync find --class ProximityPrompt", "ksync find --name Boss --under Workspace"],
  },

  // ------------------------------------------------------------- mutation
  set: {
    op: "set",
    group: "Write",
    summary: "Set one property",
    positional: { required: ["path", "prop", "value"] },
    flags: { forceParent: "override the Parent guardrail" },
    examples: ["ksync set Workspace/Camera FieldOfView 80"],
  },
  new: {
    op: "new",
    group: "Write",
    summary: "Create an instance",
    positional: { required: ["class"], optional: ["parent", "name"] },
    examples: ["ksync new Part Workspace Crate"],
  },
  rm: {
    op: "rm",
    group: "Write",
    summary: "Destroy an instance",
    positional: { required: ["path"] },
    examples: ["ksync rm Workspace/Crate"],
  },
  mv: {
    op: "mv",
    group: "Write",
    summary: "Reparent an instance",
    positional: { required: ["from", "to"] },
    flags: { force: "allow a cross-service move" },
    examples: ["ksync mv Workspace/Crate ReplicatedStorage"],
  },
  attr: {
    op: "attr",
    group: "Write",
    summary: "Attributes: ls, set, rm",
    positional: { required: ["path"], optional: ["action", "name", "value"] },
    examples: ["ksync attr Workspace/Boss", "ksync attr Workspace/Boss set tier elite"],
  },
  tag: {
    op: "tag",
    group: "Write",
    summary: "CollectionService tags: ls, add, rm",
    positional: { required: ["path"], optional: ["action", "name"] },
    examples: ["ksync tag Workspace/Boss add enemy"],
  },
  select: {
    op: "select",
    group: "Write",
    summary: "Read or set the Studio selection",
    variadic: "paths",
    examples: ["ksync select", "ksync select Workspace/Boss"],
  },

  // -------------------------------------------------------------- runtime
  eval: {
    op: "eval",
    group: "Studio",
    summary: "Run Luau inside Studio",
    positional: { required: ["source"] },
    examples: ["ksync eval 'return #workspace:GetChildren()'"],
  },
  logs: {
    op: "logs",
    group: "Studio",
    summary: "Recent Studio output",
    flags: { level: "info | warn | error", limit: "how many lines" },
    examples: ["ksync logs --level warn"],
  },
  undo: { op: "undo", group: "Studio", summary: "Undo the last change" },
  redo: { op: "redo", group: "Studio", summary: "Redo the last undone change" },
  ping: { op: "ping", group: "Studio", summary: "Round-trip the plugin and report latency" },

  // -------------------------------------------------------------- capture
  photo: {
    op: "photo",
    group: "Capture",
    timeoutMs: 120000,
    summary: "Capture the Studio viewport as a PNG",
    flags: {
      out: "output file (default ./capture.png)",
      subject: "path to frame the camera on, e.g. Workspace/Boss",
      isolate: "render the subject alone on a transparent background",
      tight: "crop an isolated render to the pixels that were drawn (default true)",
      margin: "how much air to leave around the subject (default 1.25)",
      region: "x,y,width,height to crop in the viewport",
      delay: "seconds to wait before the frame is taken",
      context: "capture inside a running playtest: client or server",
      ui: "\"none\" leaves the GUI out (StudioCaptureService captures only)",
    },
    examples: [
      "ksync photo --out shot.png",
      "ksync photo --subject Workspace/Boss --out boss.png",
      "ksync photo --subject Workspace/Boss --isolate --out boss.png",
      "ksync photo --region 0,0,512,512 --out crop.png",
    ],
  },
  authorize: {
    op: "capture_authorize",
    group: "Capture",
    timeoutMs: 60000,
    summary: "Ask Studio for screen capture permission",
  },

  // ------------------------------------------------------------- playtest
  sync: {
    op: "sync_status",
    group: "Sync",
    summary: "Is this place syncing, and is it waiting on a prompt",
  },
  changes: {
    op: "sync_changes",
    group: "Sync",
    summary: "What a waiting sync prompt would apply, instance by instance",
  },
  accept: {
    op: "sync_accept",
    group: "Sync",
    summary: "Answer the waiting sync prompt yes",
    examples: ["ksync accept --place 130505358256570"],
  },
  cancel: {
    op: "sync_cancel",
    group: "Sync",
    summary: "Answer the waiting sync prompt no (this ends the session)",
  },
  connect: {
    op: "sync_connect",
    group: "Sync",
    summary: "Attach this place to a project, starting its server if needed",
    positional: { optional: ["project"] },
    timeoutMs: 30000,
    examples: ["ksync connect", "ksync connect ED2"],
  },
  disconnect: {
    op: "sync_disconnect",
    group: "Sync",
    summary: "Detach this place from its project",
  },
  playtest: {
    op: "playtest_start",
    group: "Playtest",
    summary: "Start a playtest (play, run, or multiplayer)",
    positional: { optional: ["mode"] },
    flags: { players: "PlayClients in multiplayer mode (1-8)" },
    timeoutMs: 30000,
    examples: ["ksync playtest", "ksync playtest multiplayer --players 2"],
  },
  playing: { op: "playtest_status", group: "Playtest", summary: "Is a playtest running, and which contexts are up" },
  stop: { op: "playtest_stop", group: "Playtest", summary: "End the running playtest" },
  run: {
    op: "playtest_exec",
    group: "Playtest",
    summary: "Run Luau inside a playtest context",
    positional: { optional: ["source"] },
    flags: { context: "server (default) or client", script: "read the source from a file instead" },
    timeoutMs: 30000,
    examples: [
      "ksync run 'return #game.Players:GetPlayers()'",
      "ksync run --script checks/spawn.luau --context client",
    ],
  },
  test: {
    local: "test",
    group: "Playtest",
    summary: "Run a Luau file in a fresh playtest and report pass or fail",
    positional: { required: ["file"] },
    flags: {
      context: "server (default) or client",
      mode: "play (default), run, or multiplayer",
      players: "PlayClients in multiplayer mode (1-8)",
    },
    examples: ["ksync test checks/spawn.luau", "ksync test checks/net.luau --mode multiplayer --players 2"],
  },

  // ------------------------------------------------------------- transfer
  copy: {
    op: "clipboard_copy",
    group: "Transfer",
    summary: "Copy instances to the cross-project clipboard",
    variadic: "paths",
    examples: ["ksync copy Workspace/Boss", "ksync copy   # uses the Studio selection"],
  },
  paste: {
    op: "clipboard_paste",
    group: "Transfer",
    summary: "Paste the clipboard into the connected place",
    positional: { optional: ["to"] },
    examples: ["ksync paste", "ksync paste ReplicatedStorage"],
  },

  // ---------------------------------------------------------------- local
  capabilities: { op: "capabilities", group: "Info", summary: "What this plugin and Studio can do" },
  status: { local: "status", group: "Info", summary: "Daemon, plugin, and project status" },
  projects: { local: "projects", group: "Info", summary: "List known projects" },
  commands: { local: "commands", group: "Info", summary: "Machine-readable command registry" },
  doctor: {
    local: "doctor",
    group: "Info",
    summary: "Check the setup and say what to fix",
    examples: ["ksync doctor"],
  },
  help: { local: "help", group: "Info", summary: "Show this help" },
  "new-command": {
    local: "new-command",
    group: "Info",
    summary: "Scaffold a custom command, ready to run before it is edited",
    positional: { required: ["name"] },
    flags: {
      kind: "luau (default, runs in Studio), node (runs on this machine), or workflow (declarative steps)",
      global: "put it in ~/.koshersync/commands for every project, instead of this one's .koshersync/commands",
    },
    examples: [
      "ksync new-command anchor-lights",
      "ksync new-command sweep-shots --kind node --global",
    ],
  },
  map: {
    local: "map",
    group: "Info",
    summary: "Add the code-bearing services this project does not map yet",
    flags: { dir: "which project (default: the one you are in)" },
    examples: ["ksync map", "ksync map --dir ~/projects/MyGame"],
  },
  agents: {
    local: "agents",
    group: "Info",
    summary: "Print the agent brief, or install it into a project's AGENTS.md",
    flags: {
      install: "add or refresh the KosherSync section in <dir>/AGENTS.md, imported from CLAUDE.md (default .)",
      only: "comma-separated groups to spell out; the rest are indexed",
      all: "spell out every group",
    },
    examples: [
      "ksync agents",
      "ksync agents --only navigate,write",
      "ksync agents --install ~/projects/MyGame --only navigate,write,playtest",
    ],
  },
};

/** Groups, in the order help should print them. */
/**
 * Commands that change the place they run in.
 *
 * Every command takes the working directory's place when nobody named one. When
 * even that cannot answer, these refuse rather than fall back to the daemon's
 * default: that default is whichever place connected most recently, and "most
 * recently connected" is not something anyone reasons about before typing `rm`.
 * A read does fall back, since it has nothing to undo — but it says which place
 * it picked, because an answer from the wrong place looks like a right one.
 */
export const MUTATING = new Set([
  "set", "new", "rm", "mv", "attr", "tag", "select",
  "eval", "undo", "redo",
  "copy", "paste",
  "playtest", "stop", "run", "test",
  // Answering a prompt or attaching a place changes what Studio holds, so they
  // get the same "say which place" treatment as any other write.
  "accept", "cancel", "connect", "disconnect",
]);

// Available on every op, so it is documented once rather than on each command.
export const GLOBAL_FLAGS = {
  place: "which connected place to act on — its ref, name, or placeId (see `ksync status`)",
};

export const GROUPS = ["Navigate", "Write", "Studio", "Capture", "Playtest", "Sync", "Transfer", "Info"];

/** The registry an agent reads. Derived, never hand-maintained. */
export function registry(available = () => true) {
  return {
    schemaVersion: 1,
    commands: Object.entries(COMMANDS).filter(([name]) => available(name)).map(([name, spec]) => ({
      name,
      group: spec.group,
      summary: spec.summary,
      op: spec.op ?? null,
      positional: spec.positional ?? (spec.variadic ? { variadic: spec.variadic } : null),
      flags: spec.flags ?? null,
      examples: spec.examples ?? [],
    })),
  };
}

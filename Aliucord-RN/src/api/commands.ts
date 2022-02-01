import { getModuleByProps } from "../utils/modules";
import { create } from '../utils/patcher';

const Patcher = create("aliucord-commands");

const Commands = getModuleByProps("getBuiltInCommands");
const Discovery = getModuleByProps("useApplicationCommandsDiscoveryState");
const Icons = getModuleByProps("getIconURL");

let commands = [];

export const section = {
  id: "aliucord",
  type: 1,
  name: "Aliucord",
  icon: "__ALIUCORD__"
};

Patcher.after(Commands, "getBuiltInCommands", (_, args, res) => {
  return [...res, ...commands];
});

Patcher.after(Icons, "getIconURL", (_, [, props]) => {
  if (props.icon === "__ALIUCORD__") {
    return "https://cdn.discordapp.com/icons/811255666990907402/912861e37f0efa5c77729592ea8f7b8f.png?size=256";
  }
});

Patcher.after(Discovery, "useApplicationCommandsDiscoveryState", (_, args, res) => {
  if (!res.discoverySections.find(d => d.key == section.id) && commands.length) {
    const cmds = [...commands.values()];

    res.applicationCommandSections.push(section);
    res.discoveryCommands.push(...cmds);
    res.commands.push(...cmds.filter(cmd => !res.commands.some(e => e.name === cmd.name)));

    res.discoverySections.push({
      data: cmds,
      key: section.id,
      section
    });

    res.sectionsOffset.push(commands.length);
   }

  const index = res.discoverySections.findIndex(e => e.key === "-2");
  if (res.discoverySections[index]?.data) {
    const section = res.discoverySections[index];
    section.data = section.data.filter(c => !c.__aliucord);

    if (section.data.length == 0) res.discoverySections.splice(index, 1);
  }
});

function registerCommands(caller, cmds) {
  cmds.map(c => {
    c.__aliucord = true;
    c.caller = caller;
  });

  commands.push(...cmds);
}

function unregisterCommands(caller) {
  commands = commands.filter(c => c.caller != caller);
}

export {
  registerCommands,
  unregisterCommands
};
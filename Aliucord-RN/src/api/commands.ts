import { getModule } from "../utils/modules";

const commandsModule = getModule(m => m.getBuiltInCommands);

function registerCommands(commands) {
  commandsModule.BUILT_IN_COMMANDS.push(...commands);
}

export {
  registerCommands
}
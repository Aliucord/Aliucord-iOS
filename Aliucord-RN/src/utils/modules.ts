declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any };

function modulesBlacklist(i) {
  // Importing these crashses Discord
  if (i == 199 || i == 432 || i == 433 || i == 444 || i == 445 || i == 456) return true;

  return false;
}

export function getModule(filter: (module: any) => boolean, exports = true): any {
  const id = Object.keys(modules).find(id => {
    if (modulesBlacklist(id)) return;

    const module = modules[id];
    if (!module.isInitialized) __r(Number(id));

    if (module.publicModule.exports === undefined) return;
    return filter(module.publicModule.exports);
  });

  if (id === undefined) return;

  const { publicModule } = modules[id];
  return exports ? publicModule.exports : publicModule;
}

export function getModules(filter: (module: any) => boolean): number[] {
  const ids = Object.keys(modules).map(i => Number(i)).filter(i => {
    if (modulesBlacklist(i)) return;

    return __r(i) && filter(__r(i));
  });

  return ids;
}
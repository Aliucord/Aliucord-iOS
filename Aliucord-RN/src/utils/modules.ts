declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any };

function modulesBlacklist(i) {
  // Skip other references to window, global, ...
  if (i == 22 || i == 83 || i == 607 || i == 608) return true;

  // Importing these changes the locale
  if (i >= 940 && i <= 968) return true;

  // Importing these crashses Discord
  if (i == 199 || i == 432 || i == 433 || i == 444 || i == 445 || i == 456) return true;

  return false;
}

export function getModule(filter: (module: any) => boolean, exports = true): any {
  const id = Object.keys(modules).map(i => Number(i)).find(i => {
   if (modulesBlacklist(i)) return;

    return __r(i) && filter(__r(i));
  });

  if (id === undefined) return null;

  const module = modules[id].publicModule;
  return exports ? module.exports : module;
}

export function getModules(filter: (module: any) => boolean): number[] {
  const ids = Object.keys(modules).map(i => Number(i)).filter(i => {
    if (modulesBlacklist(i)) return;

    return __r(i) && filter(__r(i));
  });

  return ids;
}
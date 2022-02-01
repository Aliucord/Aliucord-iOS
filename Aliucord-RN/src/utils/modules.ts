declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any };

function modulesBlacklist(i) {
  if (i == 199 || i == 432 || i == 433 || i == 444 || i == 445 || i == 456) return true;

  return false;
}

function getModule(filter: (module: any) => boolean, exports = true): any {
  const ids = getModules(filter);
  if (ids.length === 0 || ids[0] === undefined) return;

  const { publicModule } = modules[ids[0]];
  return exports ? publicModule.exports : publicModule;
}

function getModules(filter: (module: any) => boolean): number[] {
  const ids = Object.keys(modules).filter(id => {
    if (modulesBlacklist(id)) return;

    const module = modules[id];
    if (!module.isInitialized) __r(Number(id));

    if (module.publicModule.exports === undefined) return;
    return filter(module.publicModule.exports);
  });

  return ids.map(id => Number(id));
}

function getModuleByProps(...props: string[]) {
  return getModule(m => props.every(p => m[p]), true);
}

export {
  getModule,
  getModules,
  getModuleByProps
};
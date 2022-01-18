
declare const __r: (moduleId: number) => any;
declare const modules: { [id: number]: any };

export function getModule(filter: (module: any) => boolean, exports = true): any {
  const id = Object.keys(modules).map(i => Number(i)).find(i => {
    if (i >= 940 && i <= 968) return false;

    if (
      i == 199 ||
      i == 432 ||
      i == 433 ||
      i == 444 ||
      i == 445 ||
      i == 456
    ) return false;

    return __r(i) && filter(__r(i));
  });

  if (id === undefined) return null;

  const module = modules[id].publicModule;
  return exports ? module.exports : module;
}

window["getModule"] = getModule;
import { getModule } from "./modules";

const assets = [];

const assetsModule = getModule(m => m.registerAsset);
const _registerAsset = assetsModule.registerAsset;
assetsModule.registerAsset = (asset: Record<string, string>) => {
  assets.push(asset.name);
  _registerAsset(asset);
}

function getAssetByName(name: string) {
  return assets.find(a => name);
}

window["getAssetByName"] = getAssetByName;

export {
  getAssetByName
}
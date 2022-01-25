import { getModule } from "../utils/modules";

const storageModule = getModule(m => m.getItem);

async function getItem(name) {
  return new Promise((resolve, reject) => {
    storageModule.getItem(name).then((data: string | null) => {
      resolve(data);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

async function setItem(name, value): Promise<void> {
  return new Promise((resolve, reject) => {
    storageModule.setItem(name, value).then(() => {
      resolve();
    }).catch((err: any) => {
      reject(err);
    });
  });
}

async function removeItem(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    storageModule.removeItem(name).then(() => {
      resolve();
    }).catch((err: any) => {
      reject(err);
    });
  });
}

export {
  getItem,
  setItem,
  removeItem
}
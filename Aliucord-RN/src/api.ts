import { getModule, getModules } from "./utils/modules";
import { getAssetByName, getAssets } from "./utils/assets";
import { createPatch, patchBefore, patchInstead, patchAfter } from "./utils/patcher";

import { sendReply } from "./api/clyde";
import { registerCommands } from "./api/commands";
import { showDialog } from "./api/dialog";
import { reloadDiscord, getVersion, getBuild, getDevice, getSystemVersion } from "./api/native";
import { get, post, put, patch, _delete, getAPIBaseURL } from "./api/rest";
import { getItem, setItem, removeItem } from "./api/storage";
import { showToast } from "./api/toast";
import { getToken, setToken, hideToken, showToken, removeToken } from "./api/token";
import { fetchCurrentUser, fetchProfile, getUser } from "./api/users";

export function prepareApi() {
  window["aliucord"] = {
    "getModule": getModule,
    "getModules": getModules,
    "getAssetByName": getAssetByName,
    "getAssets": getAssets,

    "patcher": {
      createPatch,
      patchBefore,
      patchInstead,
      patchAfter
    },

    "clyde": {
      sendReply
    },

    "commands": {
      registerCommands
    },

    "dialog": {
      showDialog
    },

    "native": {
      reloadDiscord,
      getVersion,
      getBuild,
      getDevice,
      getSystemVersion
    },

    "rest": {
      get,
      post,
      put,
      patch,
      delete: _delete,
      getAPIBaseURL
    },

    "storage": {
      getItem,
      setItem,
      removeItem
    },

    "toast": {
      showToast
    },

    "token": {
      getToken,
      setToken,
      hideToken,
      showToken,
      removeToken
    },

    "users": {
      fetchCurrentUser,
      fetchProfile,
      getUser
    }
  }
}

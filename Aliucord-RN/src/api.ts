import { getModule, getModules } from "./utils/modules";
import { getAssetByName, getAssets } from "./utils/assets";

import { sendReply } from "./api/clyde";
import { registerCommands } from "./api/commands";
import { show } from "./api/dialog";
import { reloadDiscord, getVersion, getBuild, getDevice, getSystemVersion } from "./api/native";
import { get, post, put, patch, _delete, getAPIBaseURL } from "./api/rest";
import { getItem, setItem, removeItem } from "./api/storage";
import { getToken, setToken, hideToken, showToken, removeToken } from "./api/token";
import { fetchCurrentUser, fetchProfile, getUser } from "./api/users";

export function prepareApi() {
  window["getAssetByName"] = getAssetByName;
  window["getAssets"] = getAssets;

  window["aliucord"] = {
    "getModule": getModule,
    "getModules": getModules,
    "getAssetByName": getAssetByName,
    "getAssets": getAssets,

    "clyde": {
      sendReply
    },

    "commands": {
      registerCommands
    },

    "dialog": {
      show
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

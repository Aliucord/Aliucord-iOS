import { getModule, getModules, getModuleByProps, getModuleByIndex } from "../utils/modules";
import { getAssetByName, getAssets } from "../utils/assets";
import { create, before, instead, after } from "../utils/patcher";
import { connectWebsocket } from "../utils/websocket";

import { sendReply } from "./clyde";
import { registerCommands, unregisterCommands } from "./commands";
import { showDialog } from "./dialog";
import { reloadDiscord, getVersion, getBuild, getDevice, getSystemVersion } from "./native";
import { get, post, put, patch, _delete, getAPIBaseURL } from "./rest";
import { getItem, setItem, removeItem } from "./storage";
import { registerPlugin, getPlugin, getPlugins, disablePlugin, enablePlugin } from "./plugin";
import { getTheme, getThemeByName, listThemes, applyTheme, registerTheme, removeTheme } from "./themes";
import { showToast } from "./toast";
import { getToken, setToken, hideToken, showToken, removeToken } from "./token";
import { fetchCurrentUser, fetchProfile, getUser } from "./users";

export function prepareApi() {
  window["aliucord"] = {
    "getModule": getModule,
    "getModules": getModules,
    "getModuleByProps": getModuleByProps,
    "getModuleByIndex": getModuleByIndex,
    "getAssetByName": getAssetByName,
    "getAssets": getAssets,

    "__ALIUCORD_INTERNAL_IF_YOU_USE_THIS_I_WILL_NUKE_YOU__": {
      connectWebsocket,
    },

    "themer": {
      theme: "",
      themes: [],
      getTheme,
      getThemeByName,
      listThemes,
      applyTheme,
      registerTheme,
      removeTheme,
    },

    "patcher": {
      create,
      before,
      instead,
      after
    },

    "plugins": {
      enabled: [],
      disabled: [],
      
      registerPlugin,
      getPlugin,
      getPlugins,

      disablePlugin,
      enablePlugin
    },

    "clyde": {
      sendReply
    },

    "commands": {
      registerCommands,
      unregisterCommands
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

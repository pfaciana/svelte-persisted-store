"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var svelte_persisted_store_exports = {};
__export(svelte_persisted_store_exports, {
  persisted: () => persisted,
  writable: () => writable
});
module.exports = __toCommonJS(svelte_persisted_store_exports);
var import_store = require("svelte/store");
var stores = {
  local: {},
  session: {}
};
function getStorage(type) {
  if (typeof type !== "string") {
    stores[type.valueOf()] = {};
    return type;
  }
  return type === "local" ? localStorage : sessionStorage;
}
function writable(key, initialValue, options) {
  console.warn("writable() has been deprecated. Please use persisted() instead.\n\nchange:\n\nimport { writable } from 'svelte-persisted-store'\n\nto:\n\nimport { persisted } from 'svelte-persisted-store'");
  return persisted(key, initialValue, options);
}
function persisted(key, initialValue, options) {
  var _a, _b, _c, _d, _e, _f;
  const serializer = (_a = options == null ? void 0 : options.serializer) != null ? _a : JSON;
  const storageType = (_c = (_b = options == null ? void 0 : options.storage) == null ? void 0 : _b.valueOf()) != null ? _c : "local";
  const syncTabs = (_d = options == null ? void 0 : options.syncTabs) != null ? _d : true;
  const onError = (_e = options == null ? void 0 : options.onError) != null ? _e : (e) => console.error(`Error when writing value from persisted store "${key}" to ${storageType}`, e);
  const browser = typeof window !== "undefined" && typeof document !== "undefined";
  const storage = browser ? getStorage((_f = options == null ? void 0 : options.storage) != null ? _f : "local") : (options == null ? void 0 : options.storage) && typeof options.storage !== "string" ? options.storage : null;
  function updateStorage(key2, value) {
    try {
      storage == null ? void 0 : storage.setItem(key2, serializer.stringify(value));
    } catch (e) {
      onError(e);
    }
  }
  function maybeLoadInitial() {
    const json = storage == null ? void 0 : storage.getItem(key);
    if (json) {
      return serializer.parse(json);
    }
    return initialValue;
  }
  if (!stores[storageType][key]) {
    const initial = maybeLoadInitial();
    const store = (0, import_store.writable)(initial, (set2) => {
      if (browser && storageType == "local" && syncTabs) {
        const handleStorage = (event) => {
          if (event.key === key)
            set2(event.newValue ? serializer.parse(event.newValue) : null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
      }
    });
    const { subscribe, set } = store;
    stores[storageType][key] = {
      set(value) {
        set(value);
        updateStorage(key, value);
      },
      update(callback) {
        return store.update((last) => {
          const value = callback(last);
          updateStorage(key, value);
          return value;
        });
      },
      subscribe
    };
  }
  return stores[storageType][key];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  persisted,
  writable
});
//# sourceMappingURL=index.js.map
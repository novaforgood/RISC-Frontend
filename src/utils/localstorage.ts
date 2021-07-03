type JSONType = Object | string | boolean | number;

const LocalStorage = {
  set: (key: string, val: JSONType) => {
    window.localStorage.setItem(key, JSON.stringify(val));
  },
  get: (key: string): JSONType | null => {
    const ret = window.localStorage.getItem(key);
    if (!ret) return null;
    return JSON.parse(ret);
  },
  delete: (key: string) => {
    window.localStorage.removeItem(key);
  },
  clear: () => {
    window.localStorage.clear();
  },
};

export default LocalStorage;

export const setLocalStorageItem = <T>(key: string, payload: T) => {
  localStorage.setItem(key, JSON.stringify(payload));
};

export const getLocalStorageItem = <T>(key: string): T | null => {
  const jsonString = localStorage.getItem(key);

  if (jsonString) {
    return JSON.parse(jsonString);
  }

  return null;
};

export const removeLocalStorageItem = (key: string) => {
  return localStorage.removeItem(key);
};

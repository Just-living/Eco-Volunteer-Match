import { mockDB } from "../data/mockData";

const KEY = "evm_db_v1";

export function initDB() {
  const existing = localStorage.getItem(KEY);
  if (!existing) {
    localStorage.setItem(KEY, JSON.stringify(mockDB));
  }
}

export function loadDB() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetDB() {
  localStorage.setItem(KEY, JSON.stringify(mockDB));
}

export function delay(ms = 350) {
  return new Promise((res) => setTimeout(res, ms));
}

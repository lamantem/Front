import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Constructor
   *
   */
  constructor() {
  }

  /**
   * Save an item in the local storage
   *
   * @param key
   * @param value
   */
  public setItem(key: string, value: any) {
    return localStorage.setItem(key, value);
  }

  /**
   * Return an item from local storage
   *
   * @param key
   */
  public getItem(key: string) {
    return localStorage.getItem(key);
  }

  /**
   * Remove an item from local storage
   *
   * @param key
   */
  public clearItem(key: string) {
    return localStorage.removeItem(key);
  }

  /**
   * Clean all item from local storage
   *
   */
  public clearAll() {
    return localStorage.clear();
  }
}

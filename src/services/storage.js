/**
 * Text storage service for managing text documents in localStorage
 * Uses text names as primary keys while supporting duplicate names
 */

const STORAGE_KEY = "smarter_text_engine";

/**
 * Initialize storage with default texts if not already present
 * @param {Object} defaultTexts - Object with text name as key and content as value
 * @returns {Object} The initialized texts
 */
export const initializeStorage = (defaultTexts = {}) => {
  const storage = getStorageData();

  // If storage is empty, populate with default texts
  if (Object.keys(storage.texts).length === 0) {
    Object.entries(defaultTexts).forEach(([name, content]) => {
      saveText(name, content);
    });
  }

  return storage.texts;
};

/**
 * Get all storage data
 * @returns {Object} The complete storage object
 */
const getStorageData = () => {
  const storageData = localStorage.getItem(STORAGE_KEY);
  if (!storageData) {
    return { texts: {}, duplicates: {} };
  }

  try {
    return JSON.parse(storageData);
  } catch (error) {
    console.error("Error parsing storage data:", error);
    return { texts: {}, duplicates: {} };
  }
};

/**
 * Save storage data
 * @param {Object} data - The data to save
 */
const saveStorageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/**
 * Save a text
 * @param {string} name - The name/path of the text
 * @param {string} content - The content of the text
 * @returns {string} The name of the saved text (possibly modified if duplicate)
 */
export const saveText = (name, content) => {
  const storage = getStorageData();

  // Check if this is a new text or updating an existing one
  if (!storage.texts[name]) {
    // New text - check for duplicates
    if (storage.duplicates[name]) {
      // This is a duplicate, add suffix
      const count = storage.duplicates[name];
      const newName = `${name}_${count}`;
      storage.duplicates[name] = count + 1;

      // Add the new text
      storage.texts[newName] = {
        originalName: name,
        content,
        lastModified: new Date().toISOString(),
      };

      saveStorageData(storage);
      return newName;
    } else {
      // First text with this name
      storage.texts[name] = {
        originalName: name,
        content,
        lastModified: new Date().toISOString(),
      };

      saveStorageData(storage);
      return name;
    }
  } else {
    // Update existing text
    storage.texts[name].content = content;
    storage.texts[name].lastModified = new Date().toISOString();

    saveStorageData(storage);
    return name;
  }
};

/**
 * Create a new text with a given name
 * @param {string} name - The desired name of the text
 * @param {string} content - The content of the text
 * @returns {string} The actual name used (may be modified if duplicate)
 */
export const createNewText = (name, content = "") => {
  return saveText(name, content);
};

/**
 * Get a text by its name
 * @param {string} name - The name of the text
 * @returns {Object|null} The text object or null if not found
 */
export const getTextByName = (name) => {
  const storage = getStorageData();
  return storage.texts[name] || null;
};

/**
 * Get all texts
 * @returns {Object} An object with text names as keys and text objects as values
 */
export const getAllTexts = () => {
  const storage = getStorageData();
  return storage.texts;
};

/**
 * Update an existing text
 * @param {string} name - The name of the text
 * @param {string} content - The new content
 * @returns {boolean} True if successful, false otherwise
 */
export const updateText = (name, content) => {
  const storage = getStorageData();

  if (!storage.texts[name]) {
    return false;
  }

  storage.texts[name].content = content;
  storage.texts[name].lastModified = new Date().toISOString();

  saveStorageData(storage);
  return true;
};

/**
 * Delete a text
 * @param {string} name - The name of the text
 * @returns {boolean} True if successful, false otherwise
 */
export const deleteText = (name) => {
  const storage = getStorageData();

  if (!storage.texts[name]) {
    return false;
  }

  delete storage.texts[name];

  saveStorageData(storage);
  return true;
};

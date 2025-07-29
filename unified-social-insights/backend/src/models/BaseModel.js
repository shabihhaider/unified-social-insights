// backend/src/models/BaseModel.js
const { pool } = require('../utils/db');

class BaseModel {
  static async query(text, params = []) {
    try {
      const result = await pool().query(text, params);
      return result;
    } catch (error) {
      console.error(`❌ Database query error: ${error.message}`);
      throw error;
    }
  }

  static parseJSON(json) {
    if (!json) return {};
    if (typeof json === 'object') return json;
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }
}

module.exports = BaseModel;
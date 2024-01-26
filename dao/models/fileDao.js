//fileDao.js
const fs = require('fs').promises;
const path = require('path');

class FileDao {
  constructor(directoryPath) {
    this.directoryPath = directoryPath;
  }

  async saveFile(fileName, content) {
    const filePath = path.join(this.directoryPath, fileName);
    await fs.writeFile(filePath, content);
    return filePath;
  }

  async readFile(fileName) {
    const filePath = path.join(this.directoryPath, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  }

  async deleteFile(fileName) {
    const filePath = path.join(this.directoryPath, fileName);
    await fs.unlink(filePath);
  }
}

module.exports = FileDao;

import { Client } from "basic-ftp";
import { join } from "node:path";

export class Ftp {
  config = {};
  client = new Client();
  constructor(config) {
    this.config = config;
  }
  async connect() {
    return this.client.access(this.config);
  }
  async uploadFile(from, to, fileName) {
    await this.client.ensureDir(to);
    await this.client.uploadFrom(join(from, fileName), fileName);
    return this;
  }
  async uploadDir(from, to) {
    await this.client.ensureDir(to);
    await this.client.clearWorkingDir();
    await this.client.uploadFromDir(from);
    return this;
  }
  close() {
    this.client.close();
  }
}

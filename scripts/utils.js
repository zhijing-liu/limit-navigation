import { Client } from "basic-ftp";

export class Ftp {
  config = {};
  client = new Client();
  constructor(config) {
    this.config = config;
  }
  async connect() {
    return this.client.access(this.config);
  }
  async uploadFile(from, to) {
    await this.client.uploadFrom(from, to);
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

import conf from "../../conf/conf";
import { Client, Databases } from "appwrite";

export interface getPostProps {
  slug: string;
}

export interface FileIdProps {
  fileId: string;
}

export class Service {
  client: Client = new Client();
  databases: Databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  async getQuestions() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts() ::", error);
    }
  }
}

const service = new Service();
export default service;

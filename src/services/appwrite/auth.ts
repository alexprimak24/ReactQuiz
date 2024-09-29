import conf from "../../conf/conf";
import { Client, Account, ID } from "appwrite";

export interface createAccountProps {
  email: string;
  password: string;
  name?: string;
}

export interface loginProps {
  email: string;
  password: string;
}

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }: createAccountProps) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite service :: createAccount() ::", error);
    }
  }
  async login({ email, password }: loginProps) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login() ::", error);
    }
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser() ::", error);
    }
    return null;
  }
  async getCurrentSession() {
    try {
      const session = await this.account.getSession("current");
      return session.$id;
    } catch (error) {
      console.log("Appwrite service :: getCurrentSession() ::", error);
    }
    return null;
  }
  async logout() {
    try {
      const sessionId: string | null = await this.getCurrentSession();
      if (sessionId) {
        await this.account.deleteSession(sessionId);
      }
    } catch (error) {
      console.log("Appwrite service :: logout() ::", error);
    }
  }
}

const authService = new AuthService();

export default authService;

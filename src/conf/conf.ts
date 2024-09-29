const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL as string,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,
  appwriteCollectionId: import.meta.env
    .VITE_APPWRITE_COLLECTION_QUESTIONS as string,
};

export default conf;

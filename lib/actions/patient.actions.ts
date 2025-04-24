"use server";

import { ID, InputFile, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log("user created successfully", { newUser });

    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", user.email)]);

      return documents?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error: any) {
    console.log("Error fetching user", error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    if (
      !identificationDocument?.get("blobFile") ||
      !identificationDocument?.get("fileName")
    ) {
      throw new Error("Invalid identification document");
    }
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error during patient registration:", error);
    throw error; // Re-throw the error for further handling
  }
};

import CustomError from "../config/errors/CustomError";


export const verifyrequiredparams = ( body: Record<string, any>, fields: string[]) => {
    try {
      let error = false;
      let error_fields = "";
      if (body.length < 1) {
        return new CustomError('Body is Missing',400)
      }
      const element = Object.getOwnPropertyNames(body);
      for (const field of fields) {
        if (element.some((e) => e == field)) {
          if (Object.keys(body[field]).length === 0) {
            if (typeof body[field] == "number") {
              continue;
            } else {
              error = true;
              error_fields += field + ", ";
            }
          }
          continue;
        } else {
          error = true;
          error_fields += field + ", ";
        }
      }
      if (error) {
        throw new CustomError(
            `Required field(s) ${error_fields.slice(0, -2)} is missing`,
            400
          );
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      throw new CustomError((error as Error).message,400)
    }
  };

  

// firebaseFunctions.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../config/firebase/FirebaseConfig";

initializeApp(firebaseConfig);

const storage = getStorage();

interface File {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const uploadImageToFirebase = async (file: File | null, folder: string) => {
    try {
        if(!file) throw new CustomError("File Missing",404)
          console.log('file',file);
        const storageRef = ref(storage, `${folder}/${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const result = {
            name: file.originalname,
            type: file.mimetype,
            downloadURL: downloadURL
        };
        return result;
    } catch (error:any) {
        throw new CustomError(
          `${error.message}`,
          500
        );
    }
};

export const deleteImageFromFirebase = async (downloadURL:string) => {
    try {
        const imageRef = ref(storage, downloadURL);
        await deleteObject(imageRef);
      } catch (error:any) {
        throw new CustomError(
          `${error.message}`,
          500
        );
      }
  };

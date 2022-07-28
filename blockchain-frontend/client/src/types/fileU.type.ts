import internal from "stream";

export interface IFile {
    ID?: any | null,
    Owner: string,
    Format: string,
    Date: string,
    Size: string,
    File64:string,
    Name:string
  }
  export default IFile;

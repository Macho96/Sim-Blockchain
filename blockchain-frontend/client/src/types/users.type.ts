import internal from "stream";

export interface IUser {
    ID?: any | null,
    Name: string,
    LastName: string,
    UserName: string,
    Email: string,
    BirthDate: string,
    Password: string
  }
  export default IUser;

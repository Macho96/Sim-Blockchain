import http from "../http-common";
import {IUser} from "../types/users.type"
import ILoginData from "../types/login.type"
const API_DIR="/users";
class UserDataService {
  getAll() {
    return http.get<Array<IUser>>(API_DIR);
  }
  get(id: string) {
    return http.get<any>(API_DIR+`/${id}`);
  }
  login(data: ILoginData) {
    return http.post<ILoginData>(API_DIR+`/login`,data);
  }
  create(data: IUser) {
    return http.post<IUser>(API_DIR, data);
  }
  update(data: IUser, id: string) {
    return http.put<any>(API_DIR+`/${id}`, data);
  }
  
  delete(id: string) {
    return http.delete<any>(`/users/${id}`);
  }

}
export default new UserDataService();
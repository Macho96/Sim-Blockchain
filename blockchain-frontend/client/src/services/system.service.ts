import http from "../http-common";
import {ISystemOption} from "../types/system.type"
const API_DIR="/system";
class SystemDataService {
  getAll() {
    return http.get<Array<ISystemOption>>(API_DIR);
  }
  get(option: string) {
    return http.get<any>(API_DIR+`/${option}`);
  }
  create(data: ISystemOption) {
    return http.post<ISystemOption>(API_DIR, data);
  }
  update(data: ISystemOption, option: string) {
    return http.put<any>(API_DIR+`/${option}`, data);
  }
  delete(option: string) {
    return http.delete<any>(API_DIR+`/${option}`);
  }

}
export default new SystemDataService();
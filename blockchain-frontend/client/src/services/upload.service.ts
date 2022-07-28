
import http from "../http-common";
import {IFile} from "../types/fileU.type"
const API_DIR="/mempool";
class FileUploadService {
  getAll(owner:string) {
    return http.get<Array<IFile>>(API_DIR+`/UserName/${owner}`);
  }

  create(data: IFile) {
    return http.post<any>(API_DIR, data);
  }

  delete(id: string) {
    return http.delete<any>(API_DIR+`/${id}`);
  }
  deleteMany(listFiles: IFile[]) {
    return http.post<any>(API_DIR+"/deleteMany",listFiles);
  }
   addToMemPool(listFiles: IFile[]) {
    return http.post<any>(API_DIR+"/createMany",listFiles);
}
  mine(){
    return http.get<any>(API_DIR+"/mine");
  }

}
export default new FileUploadService();
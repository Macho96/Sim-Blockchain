import http from "../http-common";
import {Block} from "../types/block.type"
const API_DIR="/blockchain";


class blockchainService {
  getAll(option:string) {
    return http.get<Array<Block>>(API_DIR+`/UserName/${option}`);
  }
  getBlock(option:string){
    return http.get<Array<Block>>(API_DIR+`/Owner/${option}`);
  }

}
export default new blockchainService();
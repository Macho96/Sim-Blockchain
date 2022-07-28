import axios from "axios";
export default axios.create({
 // baseURL: "http://localhost:50776/api/",
 baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-type": "application/json"
  }
});
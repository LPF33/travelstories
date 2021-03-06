import axios from 'axios';
let instance = axios.create({
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'csrf-token',
    withCredentials: true
});

instance.interceptors.response.use(function (response) { 
    return response;

    }, function (error) {
        return Promise.reject(error);
    });

const updateAxios  = (token="") => {    

    instance.interceptors.request.use(
        config => {
            config.headers.authorization = window.localStorage.getItem("travelstories") || token;
            return config;
        },
        error => {
          return Promise.reject(error);
        }
    ); 
}

updateAxios(); 

export default instance;
export {updateAxios};
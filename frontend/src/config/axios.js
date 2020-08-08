import axios from 'axios';

let instance = axios.create({
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'csrf-token',
    withCredentials: true
});

instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
        return window.location.replace("/");
});

const getToken = token => {
    instance.interceptors.request.use(
        config => {
            config.headers.authorization = token;
            return config;
        },
        error => {
          return Promise.reject(error);
        }
    );    
}

export default instance;
export {getToken};
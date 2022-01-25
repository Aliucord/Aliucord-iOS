import { getModule } from "../utils/modules";

const restModule = getModule(m => m.default?.getAPIBaseURL);

async function get(data) {
  return new Promise((resolve, reject) => {
    restModule.default.get(data).then((response) => {
      resolve(response);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

async function post(data) {
  return new Promise((resolve, reject) => {
    restModule.default.post(data).then((response) => {
      resolve(response);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

async function put(data) {
  return new Promise((resolve, reject) => {
    restModule.default.put(data).then((response) => {
      resolve(response);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

/**
 * Do a PATCH request
 */
async function patch(data) {
  return new Promise((resolve, reject) => {
    restModule.default.patch(data).then((response) => {
      resolve(response);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

/**
 * Do a DELETE request
 */
async function _delete(data) {
  return new Promise((resolve, reject) => {
    restModule.default.delete(data).then((response) => {
      resolve(response);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

async function getAPIBaseURL() {
  return restModule.default.getAPIBaseURL();
}

export {
  get,
  post,
  put,
  patch,
  _delete,
  getAPIBaseURL
}
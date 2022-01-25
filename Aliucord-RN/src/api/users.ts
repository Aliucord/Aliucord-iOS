import { getModule } from "../utils/modules";

const userModule = getModule(m => m.fetchProfile);

async function fetchCurrentUser() {
  return new Promise((resolve, reject) => {
    userModule.fetchCurrentUser().then((user: any) => {
      resolve(user);
    }).catch(reject);
  });
}

async function fetchProfile(userID: string) {
  return new Promise((resolve, reject) => {
    userModule.fetchProfile(userID).then((profile: any) => {
      resolve(profile);
    }).catch(reject);
  });
}

async function getUser(userID: string) {
  return new Promise((resolve, reject) => {
    userModule.getUser(userID).then((user: any) => {
      resolve(user);
    }).catch(reject);
  });
}

export {
  fetchCurrentUser,
  fetchProfile,

  getUser
}
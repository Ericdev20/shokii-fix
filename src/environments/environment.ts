/*************|PROD|******************/

export const environment = {
  production: true,
  apiUrl: 'https://api.shokii.com/api',
  imgPath: 'https://api.shokii.com/api/get_image/',
  // nodeUrl: 'https://shokii-prime-node.onrender.com/',
  nodeUrl: 'https://node-shokii.onrender.com/',
  // apiUrl: 'http://localhost:8000/api',
  // imgPath: 'http://localhost:8000/api/get_image/',
  // nodeUrl: 'http://localhost:3000/',

  defaultImage: '../assets/images/defaultImage.png',
  defaultProfil: '../assets/images/defaultProfil.jpg',
  defaultMsgImg: '../assets/images/defaultMsgImg.jpeg',
  firebaseConfig: {
    apiKey: 'AIzaSyBvcwDTnb5gVxWunu5Ulu8I3D1XZ_EkO6Q',
    authDomain: 'shokii-push.firebaseapp.com',
    projectId: 'shokii-push',
    storageBucket: 'shokii-push.appspot.com',
    messagingSenderId: '421081390182',
    appId: '1:421081390182:web:2527e17ceb6acccecce1a7',
    measurementId: 'G-2WP3ZMC56Q',
    vapidKey:
      'BLp_p-6NoemL9sq5OaiVDCaogwp9P4FCVljnfNnRsW8JhFCWyWFXoULkZ0vk3zqj7RCOXGBKhmd8-KvQY6ngY9w',
  },
  oauth2Config: {
    clientId: '407408718192.apps.googleusercontent.com',
    clientSecret: null,
    refreshToken:
      '4/0ATx3LY75ZHgml0PpIOhSozGMvMO9mNgRLwLBEt32RPgtBrr-qeIftzEkIhGa2qsgSbi-gA',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    refreshEndPoint:
      'https://developers.google.com/oauthplayground/refreshAccessToken',
    fcmEndpoint:
      'https://fcm.googleapis.com/v1/projects/shokii-push/messages:send',
  },
};

/***********|STAGING|******************/

// export const environment = {
//   production: true,
//   // apiUrl: 'https://admin-v1.shokii.com/api',
//   apiUrl: 'https://adm.shokii.com/api',
//   imgPath: 'https://adm.shokii.com/api/get_image/',
//   // nodeUrl:
//   //   'https://658d87fd9ab4710aa53be391--inquisitive-creponne-d5bad8.netlify.app /',
//   // nodeUrl: 'https://node-shokii.onrender.com/',
//   nodeUrl: 'https://shokii-prime-node.onrender.com/',
//   defaultImage:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPgCd93aiNba8lHWJYHQ1C1YwBPwcH_NUmw&usqp=CAU',
//   defaultProfil:
//     'https://us.123rf.com/450wm/blinkblink1/blinkblink12005/blinkblink1200500015/146979464-avatar-ic%C3%B4ne-de-l-homme.jpg?ver=6',
//   defaultMsgImg:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2TLxuvRRsIOitt1DnRxsAehvCpwU9hiWH4l2mCuAZ4w&s',
// };

/*************|LOCAL|******************/

// export const environment = {
//   production: true,
//   // apiUrl: 'http://localhost:8000/api',
// //   nodeUrl: 'http://localhost:3000/',

//   apiUrl: 'https://adm.shokii.com/api',
//   imgPath: 'http://localhost:8000/api/get_image/',
//   // nodeUrl: 'https://node-shokii.onrender.com/',

//   defaultImage:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPgCd93aiNba8lHWJYHQ1C1YwBPwcH_NUmw&usqp=CAU',
//   defaultProfil:
//     'https://us.123rf.com/450wm/blinkblink1/blinkblink12005/blinkblink1200500015/146979464-avatar-ic%C3%B4ne-de-l-homme.jpg?ver=6',
//   defaultMsgImg:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2TLxuvRRsIOitt1DnRxsAehvCpwU9hiWH4l2mCuAZ4w&s',
// };

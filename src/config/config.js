import Env from './env';

let config = {
    env: Env,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {'/api/':'http://localhost:10073'},
};

// console.log('proxy /api/ :10073');
export default config;
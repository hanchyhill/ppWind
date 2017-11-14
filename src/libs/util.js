import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:10073' :
    env === 'production' ?
    'http://pp.gdmo.gq' :
    'http://pp.gdmo.gq';
//    'https://www.url.com' :
//    'https://debug.url.com';
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;
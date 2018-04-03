import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

const protocol = location.protocol;

const ajaxUrl = env === 'development' ?
    protocol + '//127.0.0.1:10073' :
    env === 'production' ?
    protocol + '//pp.gdmo.gq' :
    protocol + '//pp.gdmo.gq';
//    'https://www.url.com' :
//    'https://debug.url.com';
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

export default util;
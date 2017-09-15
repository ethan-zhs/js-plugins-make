import Zepto from 'n-zepto'
import {HMAC_SHA256_init, HMAC_SHA256_write, HMAC_SHA256_finalize} from './sha256'

//md5算法
function getMD5(encryptString) {
	const hex_md5 = require('crypto-js/md5');
    encryptString = hex_md5(encryptString);

    let md5 = '' + encryptString;	
	md5 = md5.toString();

	let md5Str = '';
	for(var j = 0; j<md5.length; j+=2){
		const str = parseInt(md5[j], 16) * 16 + parseInt(md5[j+1],16);
		md5Str += String.fromCharCode(str);
	}
    return window.btoa(md5Str);
}

//sha256 签名算法
function getSHA256(str) {
	let secret = '5L8iyqNqJcWcChMCgUHtKCfMGT5k4Gn5L1LLA5LhDVCZ9LNLtxzNR50c4M5DVJ93';
	HMAC_SHA256_init(secret);
	HMAC_SHA256_write(str);
	const mac = HMAC_SHA256_finalize();
	let macStr='';
	for(var i = 0; i<mac.length; i++){
		macStr += String.fromCharCode(mac[i]);
	}
	return window.btoa(macStr);
}


/**
 * [获得异步header]
 * @param  {[string]} method     [description]
 * @param  {[string]} requestUrl [description]
 * @param  {[string]} bodyStream [description]
 * @return {[object]} headers [description]
 */
function getHeader(method, requestUrl, bodyStream, headerAdd) {
	const Timestamp = new Date().getTime();	 
	const key = '59245790893121341869970265186506';
	let headers = {};

	const md5Str = getMD5(bodyStream);

	var contentMD5 = bodyStream != '' ? md5Str : '';
	var stringToSigned = method + '\n' + requestUrl + '\n' + Timestamp + '\n' + contentMD5;

	var sign = getSHA256(stringToSigned);

	headers = {
		"X-ITOUCHTV-Ca-Key": key,
		"X-ITOUCHTV-Ca-Timestamp": Timestamp,
		"X-ITOUCHTV-Ca-Signature": sign,
	};

	if(headerAdd.client){
		headers['X-ITOUCHTV-CLIENT'] = headerAdd.client;
	}
	
	if(headerAdd.appVersion){
		headers['X-ITOUCHTV-APP-VERSION'] = headerAdd.appVersion;
	}

	if(headerAdd.userId && headerAdd.userId != null){
		headers['X-ITOUCHTV-USER-ID'] = headerAdd.userId;
	}

	if(headerAdd.deviceId){
		headers['X-ITOUCHTV-DEVICE-ID'] = headerAdd.deviceId;
	}

	if(headerAdd.token){
		headers.Authorization = "Bearer " + headerAdd.token;
	}

	return headers;	
};


/**
 * [全局公共插件]
 * @return {[object]} [插件对象]
 */
function callApi(endpoint, method, obj) {
	var bodyStream = obj.bodyStream ? obj.bodyStream : '';
	var headers = getHeader(method, endpoint, bodyStream, obj.header);
	return new Promise( (resolve, reject) => {
		Zepto.ajax({
			type: method || 'POST',
			url: endpoint,
			data: bodyStream,
			traditional: true,
			contentType: "application/json",
			headers: headers,
			dataType: 'JSON',
			async: obj.async || true,
			beforeSend: function() {
				
			},
			success: function(res) {				
				var response = res&&res!=null?JSON.parse(res):'';
				return resolve(response);
			},
			error: function(err) {
				var error = JSON.parse(err.response)
				return reject(error);
			}
	    });
	}) 
};


/**
 * [全局获取参数方法]
 * @param [string] testParam [测试参数字符串]
*/
function urlParams(testParam, preview) {
    let paramObj = {};
	const href = window.location.href;
	if(href.split('?')[1]) {
		const strings = href.split('?')[1].split('&from=')[0].split('&appinstall=')[0];
		var paramStr = doDecode(strings);
		
		const paramList = paramStr.split('&');
		paramList.map(item => {
			paramObj[item.split('=')[0]] = item.split('=')[1];
		});
    }	
	return paramObj;
};

const params = urlParams();
const href = window.location.href.split('#')[0];

const data = {
    bodyStream: '{ "url": "' + href + '"}',
    header: {
        userId: params.userId || 0,
        deviceId: params.deviveId || 'IMEI_0',
        newsApp: 'NEWS_APP',
    }		
}

window.touchtvWechat = {
    getWechatData: () => callApi('https://api.itouchtv.cn:8090/supplementservice/v1/wechatSignature', 'POST', data)
}
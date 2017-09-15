import Zepto from 'n-zepto'
import {HMAC_SHA256_init, HMAC_SHA256_write, HMAC_SHA256_finalize} from './sha256'
import { doEncode, doDecode } from './base64';

window.touchtvWechat = {
    getWechatData: () => {console.log(1)}
}
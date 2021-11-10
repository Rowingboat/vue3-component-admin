import { encrypt, decrypt } from 'crypto-js/aes';
import { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import sha1 from 'crypto-js/sha1';
import UTF8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

export class AesEncryption {
    #key;
    #iv;

    constructor(opt = {}) {
        const { key, iv } = opt;
        if (key) {
            this.#key = parse(key);
        }
        if (iv) {
            this.#iv = parse(iv);
        }
    }

    get getOptions() {
        return {
            mode: ECB,
            padding: pkcs7,
            iv: this.#iv,
        };
    }

    // 加密
    encryptByAES(cipherText) {
        return encrypt(cipherText, this.#key, this.getOptions).toString();
    }

    // 解密
    decryptByAES(cipherText) {
        return decrypt(cipherText, this.#key, this.getOptions).toString(UTF8);
    }
}

export function encryptByBase64(cipherText) {
    return UTF8.parse(cipherText).toString(Base64);
}

export function decodeByBase64(cipherText) {
    return Base64.parse(cipherText).toString(UTF8);
}

export function encryptBySha1(password) {
    return sha1(password).toString();
}

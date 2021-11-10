import { defHttp } from '@/utils/http/axios';

const Api = {
    Login: '/login',
    GetUserInfo: '/getUserInfo',
    GetPermCode: '/getPermCode',
};

/**
 * @description: user login api
 */
export function loginApi(params, mode = 'modal') {
    return defHttp.post(
        {
            url: Api.Login,
            params,
        },
        {
            errorMessageMode: mode,
        }
    );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
    return defHttp.get({ url: Api.GetUserInfo });
}

export function getPermCode() {
    return defHttp.get({ url: Api.GetPermCode });
}

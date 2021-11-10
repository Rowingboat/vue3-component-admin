import { defHttp } from '@/utils/http/axios';

const Api = {
    Login: '/login',
    GetUserInfo: '/getUserInfo',
    GetPermCode: '/getPermCode',
};


export function getMenuList() {
    return defHttp.get({ url: Api.GetPermCode });
}

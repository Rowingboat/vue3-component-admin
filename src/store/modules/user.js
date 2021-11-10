import router from '@/router';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PageEnum } from '@/enums/pageEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { getUserInfo, loginApi } from '@/api/sys/user';
import { useMessage } from '@/utils/hooks/web/useMessage';
 
export default {
    state: () => ({
        userInfo: null,
        token: undefined,
        roleList: [],
        // 登录是否过期
        sessionTimeout: false,
    }),
    getters: {
        getUserInfo(state) {
            return state.userInfo || getAuthCache(USER_INFO_KEY) || {};
        },
        getToken(state) {
            return state.token || getAuthCache(TOKEN_KEY);
        },
        getRoleList(state) {
            return state.roleList.length > 0 ? state.roleList : getAuthCache(ROLES_KEY);
        },
        getSessionTimeout(state) {
            return !!state.sessionTimeout;
        },
    },
    mutations: {
        setToken(state, info) {
            state.token = info;
            setAuthCache(TOKEN_KEY, info);
        },
        setRoleList(state, roleList) {
            state.roleList = roleList;
            setAuthCache(ROLES_KEY, roleList);
        },
        setUserInfo(state, info) {
            state.userInfo = info;
            setAuthCache(USER_INFO_KEY, info);
        },
        setSessionTimeout(state, flag) {
            state.sessionTimeout = flag;
        },
        resetState(state) {
            state.userInfo = null;
            state.token = '';
            state.roleList = [];
            state.sessionTimeout = false;
        },
        logout(_, goLogin = false) {
            goLogin && router.push(PageEnum.BASE_LOGIN);
        },
    },
    actions: {
        async login(context, params) {
            const { commit, state } = context;
            try {
                const { goHome = true, mode, ...loginParams } = params;
                const data = await loginApi(loginParams, mode);
                const { token } = data;

                // save token
                commit('setToken', token);
                // get user info
                const userInfo = await this.getUserInfoAction();

                const sessionTimeout = state.sessionTimeout;
                sessionTimeout && commit('setSessionTimeout', false);
                !sessionTimeout && goHome && (await router.replace(PageEnum.BASE_HOME));
                return userInfo;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async getUserInfoAction(context) {
            const { commit } = context;
            const userInfo = await getUserInfo();
            const { roles } = userInfo;
            const roleList = roles.map((item) => item.value);
            commit('setUserInfo', userInfo);
            commit('setRoleList', roleList);
            return userInfo;
        },
        /**
         * @description: 注销前确认
         */
        confirmLoginOut(context) {
            const { createConfirm } = useMessage();
            createConfirm({
                iconType: 'warning',
                title: '退出登录',
                content: '是否退出登录！',
                onOk: async () => {
                    await context.commit('logout', true);
                },
            });
        },
    },
};

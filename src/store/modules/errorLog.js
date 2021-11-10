import { formatToDateTime } from '@/utils/dateUtil';
import projectSetting from '@/utils/settings/projectSetting';
import { ErrorTypeEnum } from '@/enums/exceptionEnum';

export default {
    state: () => ({
        errorLogInfoList: null,
        errorLogListCount: 0,
    }),
    getters: {
        getErrorLogInfoList: (store) => store.errorLogInfoList || [],
        getErrorLogListCount: (store) => store.errorLogListCount,
    },
    mutations: {
        addErrorLogInfo(state, info) {
            const item = {
                ...info,
                time: formatToDateTime(new Date()),
            };
            state.errorLogInfoList = [item, ...(state.errorLogInfoList || [])];
            state.errorLogListCount += 1;
        },

        setErrorLogListCount(state, count) {
            state.errorLogListCount = count;
        },
    },
    actions: {
        /**
         * ajax请求错误后触发
         * @param error
         * @returns
         */
        addAjaxErrorInfo(context, error) {
            const { useErrorHandle } = projectSetting;
            if (!useErrorHandle) {
                return;
            }
            const errInfo = {
                message: error.message,
                type: ErrorTypeEnum.AJAX,
            };
            if (error.response) {
                const {
                    config: { url = '', data: params = '', method = 'get', headers = {} } = {},
                    data = {},
                } = error.response;
                errInfo.url = url;
                errInfo.name = 'Ajax Error!';
                errInfo.file = '-';
                errInfo.stack = JSON.stringify(data);
                errInfo.detail = JSON.stringify({ params, method, headers });
            }
            context.commit('addErrorLogInfo', errInfo);
        },
    },
};

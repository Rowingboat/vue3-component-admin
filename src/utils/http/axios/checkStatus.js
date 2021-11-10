// @ts-nocheck
import { useMessage } from '@/utils/hooks/web/useMessage';
// import router from '/@/router';
// import { PageEnum } from '/@/config/enums/pageEnum';
import { useStore } from "vuex"
import projectSetting from '@/utils/settings/projectSetting';
import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';

const { createMessage, createErrorModal } = useMessage();

const error = createMessage.error;
const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(status, msg, errorMessageMode) {
  const store = useStore();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: 未登录
    // 如果未登录，则跳转到登录页面，并携带当前页面的路径
    // 登录成功后返回到当前页面。该步骤需要在登录界面进行操作。
    case 401:
      errMessage = '401'
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        store.commit('app/setToken',undefined)
        store.commit('app/setSessionTimeout',true)
      } else {
        store.commit('app/logout',true)
      }
      break;
    case 403:
      errMessage = '403'
      break;
    // 404请求不存在
    case 404:
      errMessage = '404'
      break;
    case 405:
      errMessage = '405'
      break;
    case 408:
      errMessage = '408'
      break;
    case 500:
      errMessage = '500'
      break;
    case 501:
      errMessage = '501'
      break;
    case 502:
      errMessage = '502'
      break;
    case 503:
      errMessage = '503'
      break;
    case 504:
      errMessage = '504'
      break;
    case 505:
      errMessage = '505'
      break;
    default:
  }
  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: 'errorTip', content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}

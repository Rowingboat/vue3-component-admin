// @ts-nocheck
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '@/enums/menuEnum';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
    ContentEnum,
    PermissionModeEnum,
    ThemeEnum,
    RouterTransitionEnum,
    SettingButtonPositionEnum,
    SessionTimeoutProcessingEnum
} from '@/enums/appEnum';
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';
// import { primaryColor } from '../../../build/config/themeConfig';

// 修改后需要清空浏览器缓存
const setting = {
    // 是否显示配置按钮
    showSettingButton: true,

    // 是否显示主题切换按钮
    showDarkModeToggle: true,

    // “设置”按钮的位置
    settingButtonPosition: SettingButtonPositionEnum.AUTO,

    // 权限模式
    permissionMode: PermissionModeEnum.ROLE,

    // 与权限相关的缓存存储在sessionStorage或localStorage中
    permissionCacheType: CacheTypeEnum.LOCAL,

    // 会话超时处理
    sessionTimeoutProcessing:SessionTimeoutProcessingEnum.ROUTE_JUMP,

    // 主题颜色
    // themeColor: primaryColor,

    // 网站灰色模式，为可能的悼念日期开放
    grayMode: false,

    // 色弱模式
    colorWeak: false,

    // 是否取消菜单、顶部、多标签页显示，可能嵌入其他系统
    fullContent: false,

    // 内容模式
    contentMode: ContentEnum.FULL,

    // 是否显示logo
    showLogo: true,

    // 是否显示页脚
    showFooter: false,

    // 导航栏配置
    headerSetting: {
        // 背景颜色
        bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
        // 固定在顶部
        fixed: true,
        //是否显示顶部
        show: true,
        // 主题
        theme: ThemeEnum.LIGHT,
        // 是否开启锁屏功能
        useLockPage: true,

        // 是否显示全屏按钮
        showFullScreen: true,
        // 是否显示文档按钮以显示全屏按钮
        showDoc: false,
        // 是否显示通知按钮
        showNotice: true,
        // 是否显示菜单搜索
        showSearch: true,
    },

    // 菜单配置
    menuSetting: {
        // 侧边栏菜单bg颜色
        bgColor: SIDE_BAR_BG_COLOR_LIST[0],
        //  是否修复左侧菜单
        fixed: true,
        // 菜单关闭
        collapsed: false,
        // 折叠菜单时是否显示菜单名称
        collapsedShowTitle: false,
        // 是否可以拖
        // 仅限打开左侧菜单时，鼠标在右侧菜单上有一个拖动条
        canDrag: false,
        // 是否显示没有dom
        show: true,
        // 是否显示dom
        hidden: false,
        // 菜单宽度
        menuWidth: 210,
        // 菜单模式
        mode: MenuModeEnum.INLINE,
        // 菜单属性
        type: MenuTypeEnum.SIDEBAR,
        // 菜单主题
        theme: ThemeEnum.DARK,
        // 拆分菜单
        split: false,
        // 顶部菜单布局
        topMenuAlign: 'center',
        // 折叠触发固定位置
        trigger: TriggerEnum.HEADER,
        // 打开手风琴模式，只显示一个菜单
        accordion: true,
        // 切换页面到关闭菜单
        closeMixSidebarOnChange: false,
        // 模块打开方法' click ' |'hover'
        mixSideTrigger: MixSidebarTriggerEnum.CLICK,
        // 固定扩展菜单
        mixSideFixed: false,
    },

    // 多标签
    multiTabsSetting: {
        cache: false,
        // 打开
        show: true,
        // 可以拖放排序标签吗
        canDrag: true,
        // 启动快速行动
        showQuick: true,

        // 是否显示刷新按钮
        showRedo: true,
        // 是否显示折叠按钮
        showFold: true,
    },

    // 过渡设置
    transitionSetting: {
        //  是否打开页面切换动画
        // 禁用状态也会禁用页面加载
        enable: true,

        // 基本切换动画
        basicTransition: RouterTransitionEnum.FADE_SIDE,

        // 是否打开页面切换加载
        // 仅当enable=true时打开
        openPageLoading: true,

        // 是否打开顶部进度条
        openNProgress: false,
    },

    // 是否启用KeepAlive缓存最好在开发过程中关闭，否则每次都需要清除缓存
    openKeepAlive: true,

    // 自动锁屏时间，0不锁屏。单位分钟默认值0
    lockTime: 0,

    // 是否显示面包屑
    showBreadCrumb: true,

    // 是否显示面包屑图标
    showBreadCrumbIcon: false,

    // 使用error-handler-plugin
    useErrorHandle: false,

    // 是否打开回顶部
    useOpenBackTop: true,

    //  可以嵌入iframe页面吗
    canEmbedIFramePage: true,

    // 切换接口时是否删除未关闭消息和通知
    closeMessageOnSwitch: true,

    // 是否取消切换接口时已经发送但没有响应的http请求。
    // 如果启用，我想覆盖单个接口。可以设置在单独的接口吗
    removeAllHttpPending: false,
};

export default setting;

import router from '@/router';

import { createMessageGuard } from './messageGuard';
import { createHttpGuard } from './httpGuard';
import { createPageGuard } from './pageGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';
import { createProgressGuard } from './progressGuard';
import { createStateGuard } from './stateGuard';
import { createPermissionGuard } from './permissionGuard';
import { createScrollGuard } from './scrollGuard';


export function setupRouterGuard() {
    createPageGuard(router);
    createPageLoadingGuard(router);
    createHttpGuard(router);
    createScrollGuard(router);
    createMessageGuard(router);
    createProgressGuard(router);
    createPermissionGuard(router)
    createStateGuard(router);
    
}

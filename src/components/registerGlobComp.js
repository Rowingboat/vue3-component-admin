// import { Icon } from './Icon';
import { Button } from './comps/Button';
import {
  // Need
  Button as AntButton,
  Input,
} from 'ant-design-vue';

const compList = [AntButton.Group];

export function registerGlobComp(app) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app.use(Input).use(Button);
}

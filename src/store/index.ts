import React from 'react';
import { Keys, Storage } from './localStorage';
// import 'mobx-react-lite/batchingOptOut';
export { Keys, Storage };

// FIXME context模式和mobx observer并存有风险,需要剔除context
export default React.createContext({});

export { when } from 'mobx';
export { observer } from 'mobx-react-lite';
export { observable } from 'mobx';

export { default as appStore } from './appStore';
export { default as adStore } from './adStore';
export { default as userStore } from './userStore';

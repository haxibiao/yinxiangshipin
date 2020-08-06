import React from 'react';
import { Keys, Storage } from './localStorage';

const StoreContext = React.createContext({});
export default StoreContext;

export { when } from 'mobx';

export { observer, useObservable, useObserver } from 'mobx-react-lite';
export { default as appStore } from './appStore';
export { default as userStore } from './userStore';

export { Keys, Storage };

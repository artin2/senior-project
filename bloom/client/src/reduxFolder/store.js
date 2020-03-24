import { createStore } from 'redux';
import bloomApp from './reducers/alerts';

const store = createStore(bloomApp);

export default store;
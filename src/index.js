import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import rootReducer from './reducers/reducer.js'
import { Provider } from 'react-redux';
import { Route, withRouter } from 'react-router'
import { routerReducer, push, routerMiddleware, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import App from './App';

import './styles/index.scss';

const history = createHistory();
const middleware = routerMiddleware(history);
let loggerMiddleware = createLogger();

let store = process.env.NODE_ENV !== 'production' ? createStore (
	combineReducers({
		rootReducer,
		routing: routerReducer,
	}),
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware,
		middleware,
	),
) : createStore(
	combineReducers({
		rootReducer,
		routing: routerReducer,
	}),
	applyMiddleware(
		thunkMiddleware,
		middleware,
	),
);

ReactDOM.render(
<Provider store={store}>
  <App history={history}/> 
</Provider>,
document.getElementById('root'));

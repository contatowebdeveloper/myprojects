import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../reducers'
import thunk from 'redux-thunk'

const logger = store => next => action => {
	//console.log('Action Type on Index.js:', action.type)
	//console.log('Redux Logger:', action)
	let result = next(action)
	//console.log('Next Logger:', store.getState())
	//console.log('Next Action Type on Index.js:', action.type)
	return result
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(
	reducer,
	composeEnhancers(
		applyMiddleware(thunk, logger)
	)
)
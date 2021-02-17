import {
	GET_QUIZZES,
	GET_CATEGORY_SECTION,
	QUIZZES_LOADING,
	CATEGORY_SECTION_LOADING,
	GET_QUIZ_PUNCTATIONS_SUCCESS,
	GET_QUIZ_PUNCTATIONS_FAIL,
	QUIZZES_ERROR,
	CATEGORY_SECTION_ERROR,
	CREATE_QUIZ,
	CREATE_QUIZ_FAIL,
	UPDATE_QUIZ,
	GET_QUIZ_SUCCESS,
	GET_QUIZ_FAIL,
	DELETE_QUIZ,
	UPDATE_QUIZ_PUNCTATIONS,
} from '../actions/types'

const initialState = {
	quizzes: {
		loading: false,
		item: {
			punctations: [],
			data: {},
		},
		data: {
			pageCount: 0,
			results: [],
		},
	},
	categories: {
		loading: false,
		data: [],
	},
	sections: {
		loading: false,
		data: [],
	},
}

// eslint-disable-next-line
export default function (state = initialState, action) {
	switch (action.type) {
		case QUIZZES_LOADING:
			return {
				...state,
				quizzes: {
					...initialState.quizzes,
					loading: true,
				},
			}
		case CATEGORY_SECTION_LOADING:
			return {
				...state,
				categories: {
					...initialState.categories,
					loading: true,
				},
				sections: {
					...initialState.sections,
					loading: true,
				},
			}
		case GET_QUIZZES:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					loading: false,
					data: action.payload,
				},
			}
		case GET_CATEGORY_SECTION:
			return {
				...state,
				sections: {
					loading: false,
					data: action.payload.sections,
				},
				categories: {
					loading: false,
					data: action.payload.categories,
				},
			}
		case UPDATE_QUIZ_PUNCTATIONS:
		case GET_QUIZ_PUNCTATIONS_SUCCESS:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					item: {
						...state.quizzes.item,
						punctations: action.payload,
					},
				},
			}
		case GET_QUIZ_PUNCTATIONS_FAIL:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					item: {
						...state.quizzes.item,
						punctations: initialState.quizzes.item.punctations,
					},
				},
			}
		case QUIZZES_ERROR:
			return {
				...state,
				quizzes: initialState.quizzes,
			}
		case CATEGORY_SECTION_ERROR:
			return {
				...state,
				categories: initialState.categories,
				sections: initialState.sections,
			}
		case UPDATE_QUIZ:
		case CREATE_QUIZ:
		case GET_QUIZ_SUCCESS:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					item: {
						...state.quizzes.item,
						data: action.payload,
					},
				},
			}
		case CREATE_QUIZ_FAIL:
		case GET_QUIZ_FAIL:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					item: {},
				},
			}
		case DELETE_QUIZ:
			return {
				...state,
				quizzes: {
					...state.quizzes,
					item: {},
					data: {
						...state.quizzes.data,
						results: state.quizzes.data.results.filter(
							(quiz) => quiz.slug !== action.payload
						),
					},
				},
			}
		default:
			return state
	}
}

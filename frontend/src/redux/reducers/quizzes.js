import {
    GET_QUIZZES,
    GET_CATEGORY_SECTION,
    QUIZZES_LOADING,
    CATEGORY_SECTION_LOADING,
    QUIZZES_ERROR,
    CATEGORY_SECTION_ERROR
} from '../actions/types'

const initialState = {
    quizzes: {
        loading: false,
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
};

// eslint-disable-next-line
export default function (state=initialState, action) {
    switch (action.type) {
        case QUIZZES_LOADING:
            return {
                ...state,
                quizzes: {
                    ...initialState.quizzes,
                    loading: true,
                }
            }
        case CATEGORY_SECTION_LOADING:
                return{
                    ...state,
                    categories: {
                        ...initialState.categories,
                        loading: true,
                    },
                    sections: {
                        ...initialState.sections,
                        loading: true,
                    }
                }
        case GET_QUIZZES:
            return {
                ...state,
                quizzes: {
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
                }
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
        default:
            return state;
    };
};
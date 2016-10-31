import { SAVE_CONTENT_START, SAVE_CONTENT_FINISH, CONTENT_CHANGE } from './actions/contentActions';

const contentReducer = (state, action) => {
    switch (action.type) {
        case SAVE_CONTENT_START:
            return Object.assign({}, state, {
                showLoadingOverlay: true,
                saving: true,
            });
        case SAVE_CONTENT_FINISH:
            return Object.assign({}, state, {
                showLoadingOverlay: false,
                saving: false,
                unsavedElements: {},
            });
        case CONTENT_CHANGE:
            return Object.assign({}, state, {
                unsavedElements: action.payload
            });
    }

    return state;
};

export default contentReducer;
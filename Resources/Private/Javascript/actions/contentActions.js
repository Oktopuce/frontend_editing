import fetch from 'isomorphic-fetch';
import * as storage from '../localStorage';

const pageUrl = window.location.protocol + '//' + window.location.host;
const functionRoutes = {
    'crud': '?type=1470741815'
};
const toastrOptions = {
    'positionClass': 'toast-top-left',
    'preventDuplicates': true
};

export const CONTENT_CHANGE = 'CONTENT_CHANGE';
export const SAVE_CONTENT_START = 'SAVE_CONTENT_START';
export const SAVE_CONTENT_ERROR = 'SAVE_CONTENT_ERROR';
export const SAVE_CONTENT_SUCCESS = 'SAVE_CONTENT_SUCCESS';
export const SAVE_CONTENT_FINISH = 'SAVE_CONTENT_FINISH';

function saveContentStart() {
    return {
        type: SAVE_CONTENT_START
    };
}

function saveContentError(message) {
    toastr.error(
        message,
        FrontendEditing.labels['notifications.save-went-wrong'],
        toastrOptions
    );
    return {
        type: SAVE_CONTENT_ERROR,
    };
}

function saveContentSuccess(message) {
    toastr.success(
        FrontendEditing.labels['notifications.save-description'] + message,
        FrontendEditing.labels['notifications.save-title'],
        toastrOptions
    );
    return {
        type: SAVE_CONTENT_SUCCESS,
    };
}

function saveContentFinish() {
    return {
        type: SAVE_CONTENT_FINISH,
    };
}

const discardAllChanges = () => {
    storage.flush();
    return {
        type: CONTENT_CHANGE,
        payload: {},
    };
}

const saveAllChanges = () => {
    return function (dispatch) {
        if (!storage.isEmpty()) {
            dispatch(saveContentStart());

            const items = Immutable.Map(storage.getItems());
            let numberOfRequestsLeft = items.count();

            items.forEach(item => {
                var data = {
                    'action': item.action,
                    'table': item.table,
                    'uid': item.uid,
                    'field': item.field,
                    'content': CKEDITOR.instances[item.editorInstance].getData()
                };

                const body = Object.keys(data).map(
                    key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
                ).join('&');

                fetch(pageUrl + functionRoutes.crud, {
                    credentials: 'include',
                    method: 'post',
                    headers: {
                        'Accept': 'text/plain, text/html, application/json; charset=utf-8',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    },
                    body: body,
                })
                .then(response => {
                    numberOfRequestsLeft--;
                    if (numberOfRequestsLeft === 0) {
                        storage.flush();
                        dispatch(saveContentFinish());
                    }
                    if (response.status >= 400) {
                        throw new Error(response.statusText); // @TODO: This is not catching the ThrowStatus in CrudController!
                    } else {
                        return response.json();
                    }
                })
                .then(response => {
                    dispatch(saveContentSuccess(response.message));
                })
                .catch(err => dispatch(saveContentError(err)));
            });

        } else {
            toastr.info(
                FrontendEditing.labels['notifications.no-changes-description'],
                FrontendEditing.labels['notifications.no-changes-title'],
                toastrOptions
            );
        }

    }
}

export {
    discardAllChanges,
    saveAllChanges
};
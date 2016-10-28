import fetch from 'isomorphic-fetch';

const pageUrl = window.location.protocol + '//' + window.location.host;
const functionRoutes = {
    'crud': '?type=1470741815'
};
const localStorageKey = 'TYPO3:FrontendEditing';
const toastrOptions = {
    'positionClass': 'toast-top-left',
    'preventDuplicates': true
};

export const SAVE_CONTENT_START = 'SAVE_CONTENT_START';
function saveContentStart() {
    return {
        type: SAVE_CONTENT_START
    };
}

export const SAVE_CONTENT_ERROR = 'SAVE_CONTENT_ERROR';
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

export const SAVE_CONTENT_SUCCESS = 'SAVE_CONTENT_SUCCESS';
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

export const saveAllChanges = () => {
    return function (dispatch) {
        var items = localStorage.getItem(localStorageKey);
        if (items !== null && items !== '') {
            items = JSON.parse(items);
            items = Immutable.Map(items);
            items.forEach(item => {
                var data = {
                    'action': item.action,
                    'table': item.table,
                    'uid': item.uid,
                    'field': item.field,
                    'content': CKEDITOR.instances[item.editorInstance].getData()
                };

                dispatch(saveContentStart());

                fetch(pageUrl + functionRoutes.crud, {
                    credentials: 'include',
                    method: 'post',
                    headers: {
                        'Accept': 'text/plain, text/html',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (response.status >= 400) {
                        throw new Error(response.statusText); // @TODO: This is not catching the ThrowStatus in CrudController!
                    } else {
                        return response.json();
                    }
                })
                .then(response => {
                    dispatch(saveContentSuccess(response.message));
                    localStorage.removeItem(localStorageKey);
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
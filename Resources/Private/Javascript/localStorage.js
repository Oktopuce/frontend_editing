const LOCAL_STORAGE_KEY = 'TYPO3:FrontendEditing';

const getItems = () => {
    const itemsInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!(itemsInLocalStorage === null || itemsInLocalStorage === '')) {
        return JSON.parse(itemsInLocalStorage);
    }
    return {};
}

const isEmpty = () => {
    return Object.keys(getItems()).length === 0;
}

const flush = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export {
    getItems,
    isEmpty,
    flush
};
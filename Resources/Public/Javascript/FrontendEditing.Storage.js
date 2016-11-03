(function(w) {

    'use strict';

    var FrontendEditing = w.FrontendEditing || {};

    function getUniqueKeyForStorageBasedOnItemData(data) {
        if (data && data.table && data.uid) {
            return data.table + '-' + data.uid;
        }
    };

    FrontendEditing.Storage = function(storageKey) {
        this.storageKey = storageKey

        // Always empty the storage when it's contructed
        this.clear();
    };

    FrontendEditing.Storage.prototype = {
        addSaveItem: function (item) {
            var uniqueKeyForItem = getUniqueKeyForStorageBasedOnItemData(item);
            var saveItems = this.getSaveItems();
            var processedItems;

            // Check if the item is already
            var existingSaveItem = saveItems.get(uniqueKeyForItem);
            if (existingSaveItem) {
                // If the item is already added, then update the 'fields' 
                // assuming that fields is already set if the item exists
                existingSaveItem.fields[item.field] = item.editorInstance;
                processedItems = saveItems.set(uniqueKeyForItem, existingSaveItem);
            } else {
                var fields = {};
                fields[item.field] = item.editorInstance;
                processedItems = saveItems.set(uniqueKeyForItem, {
                    uid: item.uid,
                    table: item.table,
                    fields: fields,
                });
            }
            localStorage.setItem(this.storageKey, JSON.stringify(processedItems));
        },
        getSaveItems: function() {
            var saveItems = localStorage.getItem(this.storageKey);
            if (saveItems === null || saveItems === '') {
                saveItems = Immutable.Map({});
            } else {
                saveItems = Immutable.Map(JSON.parse(saveItems));
            }

            return saveItems;
        },
        clear: function() {
            localStorage.removeItem(this.storageKey);
        },
        isEmpty: function() {
            return this.getSaveItems().count() === 0;
        }
    };

    w.FrontendEditing = FrontendEditing;

}(window));
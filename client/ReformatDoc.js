const reformatDoc = (doc) => {
    let newDoc = {}
    // Date conversion
    for (const [key, value] of Object.entries(doc)) {
        if (Object.prototype.toString.call(value) === '[object Date]')
        {
            // This is a date field, we replace it with a fake timestamp
            newDoc[key] = {
                toDate: function(){
                    return value;
                }
            }
        } else {
            newDoc[key] = value;
        }
        // Rename field name aid to id
        if (key == "aid")
        {
            newDoc["id"] = value;
            delete newDoc["aid"];
        }
    }
    return newDoc;
}

module.exports = reformatDoc
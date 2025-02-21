export const saveToHistory = (requestObj, setState) => {
    // Create date string in human-readable form.
    const ogj_date = new Date();
    const [ day, month, year, hour, minute ] = [
        ogj_date.getDate(),
        ogj_date.getMonth() + 1, // Month is zero-indexed
        ogj_date.getFullYear(),
        ogj_date.getHours(),
        ogj_date.getMinutes()
    ];
    const date = `${day}/${month}/${year} - ${hour}:${minute}`;

    // Add additional fields: timestamp, status, and size.
    // Ensure requestObj contains these properties.
    // For response size, we assume it's provided in requestObj.size,
    // otherwise you might extract it from requestObj.headers["content-length"]
    const enhancedRequestObj = {
        ...requestObj,
        date,
        timestamp: ogj_date.getTime(),
        status: requestObj.status || "N/A",
        size: requestObj.size || (requestObj.headers && requestObj.headers["content-length"]) || "Unknown"
    };

    const srt_object = JSON.stringify(enhancedRequestObj),
          localHistory = JSON.parse(localStorage.getItem('history') || "[]");

    const history = [...localHistory, srt_object];
    localStorage.setItem('history', JSON.stringify(history));
    setState(history.map((req) => JSON.parse(req)));
}


export const getFromHistory = () => {
    const historyFromLocal = JSON.parse(localStorage.getItem('history') || "[]")
    const history = historyFromLocal.map((req) => JSON.parse(req))

    return history
}

export const deleteFromHistory = (requestObj, setState) => {
    const localHistory = JSON.parse(localStorage.getItem('history') || "[]")
    const history = localHistory.filter((req) => JSON.parse(req).id != requestObj.id)

    localStorage.setItem('history', JSON.stringify(history))
    setState([...history].map((req) => JSON.parse(req)))
}
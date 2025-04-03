export const saveToHistory = (requestObj, setState) => {
    const obj_date = new Date();
    const [day, month, year, hour, minute] = [
        obj_date.getDate(),
        obj_date.getMonth() + 1, // ✅ Fix: Add +1 to month
        obj_date.getFullYear(),
        obj_date.getHours(),
        obj_date.getMinutes(),
    ];
    const date = `${day}/${month}/${year} - ${hour}:${minute}`;

    // ✅ Store as an object instead of stringifying it manually
    const localHistory = JSON.parse(localStorage.getItem("history") || "[]");
    const history = [...localHistory, { ...requestObj, date }];

    localStorage.setItem("history", JSON.stringify(history));
    setState(history);
};

export const getFromHistory = () => {
    return JSON.parse(localStorage.getItem("history") || "[]");
};

export const deleteFromHistory = (requestObj, setState) => {
    const localHistory = JSON.parse(localStorage.getItem("history") || "[]");
    const history = localHistory.filter((req) => req.id !== requestObj.id);

    localStorage.setItem("history", JSON.stringify(history));
    setState(history);
};

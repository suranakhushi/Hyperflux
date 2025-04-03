import { useState, useEffect } from "react";

export default function useLogging() {
    const [logs, setLogs] = useState([]);

    // Load logs from localStorage on mount
    useEffect(() => {
        const storedLogs = JSON.parse(localStorage.getItem("apiLogs")) || [];
        console.log("Loaded logs:", storedLogs);
        setLogs(storedLogs);
    }, []);

    const logRequest = (method, url, requestData, responseData, status) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            method,
            url,
            requestData,
            responseData,
            status,
        };

        setLogs(prevLogs => {
            const updatedLogs = [...prevLogs, logEntry];
            console.log("Updated logs:", updatedLogs);

            // Store immediately in localStorage to reflect latest state
            localStorage.setItem("apiLogs", JSON.stringify(updatedLogs));

            return updatedLogs;
        });
    };

    const downloadJSON = (exportLogs) => {
        console.log("Exporting JSON Logs:", exportLogs);
        if (exportLogs.length === 0) {
            alert("No logs to export!");
            return;
        }
        const blob = new Blob([JSON.stringify(exportLogs, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "api_logs.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    const downloadCSV = (exportLogs) => {
        console.log("Exporting CSV Logs:", exportLogs);
        if (exportLogs.length === 0) {
            alert("No logs to export!");
            return;
        }
    
        let csvContent = "Timestamp,Method,URL,Status,Request,Response\n";
        exportLogs.forEach(log => {
            const sanitize = (data) => JSON.stringify(data || {}).replace(/"/g, '""').replace(/\n/g, ' '); // Fix newlines & quotes
            const request = sanitize(log.requestData);
            const response = sanitize(log.responseData);
    
            csvContent += `"${log.timestamp}","${log.method}","${log.url}","${log.status}","${request}","${response}"\n`;
        });
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" }); // Ensure UTF-8 encoding
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "api_logs.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    

    return { logRequest, logs, downloadJSON, downloadCSV };
}

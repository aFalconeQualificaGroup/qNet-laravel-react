// Utility functions for Task Generator

export const fmtDateHuman = (d: Date | null): string => {
    if (!d) return "";
    return d.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const formatDateParts = (date: string | null): { dateStr: string; timeStr?: string } => {
    if (!date) return { dateStr: "" };
    const d = new Date(date);
    const dateStr = d.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const hours = d.getHours();
    const minutes = d.getMinutes();

    if (hours !== 0 || minutes !== 0) {
        const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        return { dateStr, timeStr };
    }

    return { dateStr };
};

export const calculateQuickDate = (type: string): { date: Date; time: string } => {
    const today = new Date();
    let targetDate = new Date();
    let targetTime = "09:00";

    switch (type) {
        case "oggi":
            targetTime = "23:59";
            break;
        case "domani":
            targetDate.setDate(today.getDate() + 1);
            break;
        case "dopodomani":
            targetDate.setDate(today.getDate() + 2);
            break;
        case "settimana":
            targetDate.setDate(today.getDate() + 7);
            break;
        case "dueset":
            targetDate.setDate(today.getDate() + 14);
            break;
        case "mese":
            targetDate.setMonth(today.getMonth() + 1);
            break;
        case "lunedi":
            const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
            targetDate.setDate(today.getDate() + daysUntilMonday);
            break;
        case "venerdi":
            const daysUntilFriday = (12 - today.getDay()) % 7 || 7;
            targetDate.setDate(today.getDate() + daysUntilFriday);
            break;
        case "fine_mese":
            targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            targetTime = "18:00";
            break;
    }

    return { date: targetDate, time: targetTime };
};

export const getUserInitials = (name?: string, lastName?: string): string => {
    const displayName = name || "";
    const initials = displayName
        ? displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "";
    const surnameInitial = (lastName || "")
        .toUpperCase()
        .slice(0, 1);

    return initials + (surnameInitial ? ' ' + surnameInitial : '');
};

export const getUserFullName = (name?: string, lastName?: string): string => {
    if (lastName && lastName !== "") {
        return `${name || ''} ${lastName}`.trim();
    }
    return name || '';
};

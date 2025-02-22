export function getTime() {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Belgrade" }));
    return today.getHours() + today.getMinutes() / 100;
}

export function getDate() {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Belgrade" });
}

export function getDateStatus(holidays: string[], tomorrow = false) {
    const today = getDate();
    const date = new Date(today);
    if (tomorrow) {
        date.setDate(date.getDate() + 1);
    }
    const day = date.getDay();
    return day === 0 || day === 6 || holidays.includes(today) ? 'holiday' : 'workday';
}

export function getDuration(from: number, to: number) {
    if (from > to) {
        to += 24;
    }
    const minuteDiff = Math.round(to * 100 % 100 - from * 100 % 100)
    const hourDiff = Math.floor(to) - Math.floor(from);
    let result = '';
    if (minuteDiff === 0 && hourDiff === 0) {
        return result;
    }
    const diff = hourDiff * 60 + minuteDiff;
    const minutes = diff % 60;
    const hours = Math.floor(diff / 60);
    if (minutes > 0) {
        result = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`
    }
    if (hours > 0) {
        const hourResult = `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
        result = result ? `${hourResult} ${result}` : hourResult;
    }
    return result;
}


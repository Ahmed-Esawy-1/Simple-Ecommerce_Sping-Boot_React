export function formatCurrency(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(n);
}

// Backend serializes releaseDate as "dd-MM-yyyy" (see @JsonFormat on the entity).
// <input type="date"> needs "yyyy-MM-dd", so we convert both directions.
export function apiDateToInputDate(apiDate) {
    if (!apiDate) return "";
    const [day, month, year] = apiDate.split("-");
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`;
}

export function inputDateToApiDate(inputDate) {
    if (!inputDate) return "";
    const [year, month, day] = inputDate.split("-");
    if (!day || !month || !year) return "";
    return `${day}-${month}-${year}`;
}

export function formatDisplayDate(apiDate) {
    if (!apiDate) return "—";
    const [day, month, year] = apiDate.split("-");
    if (!day || !month || !year) return apiDate;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

// Utilities centered around string values.
import React from "react";
export function captialize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export const kebabCase = (s) =>
    s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
export const upperCamelCase = (s) =>
    s.replace(/(^|-)([a-z])/g, (x, y, l) => `${l.toUpperCase()}`);

export const PrettyPrintJson = React.memo(({ data }) => (
    <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
));

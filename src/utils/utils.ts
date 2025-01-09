/**
 * Formats a number to a string with two decimal places and comma as thousand separator.
 *
 * @param numero - The number to format, can be a string or a number.
 * @returns The formatted number as a string.
 */
export const formatearNumero = (numero: string | number): string => {
    const number =
        typeof numero === "string" ? Number.parseFloat(numero) : numero;

    if (Number.isNaN(number)) return "0.00";

    const numeroFormateado: string = number
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numeroFormateado;
};

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

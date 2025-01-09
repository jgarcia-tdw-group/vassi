"use client";

import type { GridSingleSelectColDef } from "@mui/x-data-grid";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import type {
    ExtendedGridColDef,
    SelectColumnOptions,
} from "~/features/quoter/utils/types";
import { formatPrice } from "~/utils/formatters";
import { editCell } from "./edit_cell";

export type EditableRow<T> = T & { isNew?: boolean };

/**
 * Fetches options from the specified table and formats them for use in a select input.
 *
 * @param params - The parameters for fetching options.
 * @param params.table - The name of the table to fetch data from.
 * @param params.valueColumn - The column name to use for the option values.
 * @param params.labelColumn - The column name or format string to use for the option labels.
 * If not provided, it defaults to the value of `valueColumn`.
 * @param params.filterQuery - An optional filter query to apply when fetching data.
 *
 * @returns A promise that resolves to an array of options,
 * each containing a `value` and a `label` property.
 */
async function fetchOptions({
    table,
    valueColumn,
    labelColumn,
    filterQuery,
}: SelectColumnOptions) {
    const response = await axios.get(
        `/api/quoter?table=${table}${filterQuery ? `&filterQuery=${filterQuery}` : ""}`,
    );

    // Set labelColumn to valueColumn if labelColumn is undefined
    if (!labelColumn) labelColumn = valueColumn;

    const options = response.data.map((row) => {
        // Replace each placeholder in the labelColumn format with values from the row
        const label = labelColumn.replace(/%\w+%/g, (placeholder) => {
            const key = placeholder.slice(1, -1); // Remove '%' characters
            return row[key] !== undefined ? row[key] : ""; // Replace with value or empty if undefined
        });

        return { value: row[valueColumn], label: label.trim() };
    });

    return options;
}

function setupUniqueValidator<T extends { id: string }>(
    column: ExtendedGridColDef<T>,
    getLocalRows: () => EditableRow<T>[],
) {
    column.preProcessEditCellProps = (params) => {
        const field = column.field as keyof T;
        const currentValue = params.row[field];
        const rows = getLocalRows();

        const hasError = rows
            .filter((row) => row[field] !== currentValue)
            .some((row) => row[field] === params.props.value);

        if (hasError)
            enqueueSnackbar("Value already exists", { variant: "error" });

        return { ...params.props, error: hasError };
    };
}

function setupPriceFormatter<T extends { id: string }>(
    column: ExtendedGridColDef<T>,
) {
    column.valueFormatter = (value: number) => formatPrice(Number(value));
}

async function setupOptions<T extends { id: string }>(
    column: ExtendedGridColDef<T>,
): Promise<void> {
    if (!column.options) return;
    column.type = "singleSelect";

    if (Array.isArray(column.options)) {
        (column as GridSingleSelectColDef<T>).valueOptions = column.options.map(
            (option) => ({
                value: option,
                label: option,
            }),
        );
    } else {
        (column as GridSingleSelectColDef<T>).valueOptions = await fetchOptions(
            column.options,
        );
    }

    column.renderEditCell = editCell(column);
}

export function transformColumns<T extends { id: string }>(
    columns: ExtendedGridColDef<T>[],
    getLocalRows: () => EditableRow<T>[],
) {
    return columns.map(async (column) => {
        if (column.unique) setupUniqueValidator(column, getLocalRows);
        if (column.isPrice) setupPriceFormatter(column);
        if (column.options) await setupOptions(column);

        return column;
    });
}

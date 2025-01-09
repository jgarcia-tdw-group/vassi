import { Autocomplete, TextField } from "@mui/material";
import {
    type GridSingleSelectColDef,
    useGridApiContext,
} from "@mui/x-data-grid";
import type { ExtendedGridColDef } from "~/features/quoter/utils/types";

export function editCell<T extends { id: string }>(
    column: ExtendedGridColDef<T>,
) {
    return function RenderEditCell(props) {
        const { id, value, field, formattedValue } = props;
        const apiRef = useGridApiContext();

        const handleValueChange = (
            _event: React.SyntheticEvent,
            newValue: { value: string; label: string } | null,
        ) => {
            apiRef.current.setEditCellValue({
                id,
                field,
                value: newValue ? newValue.value : null,
            });
        };

        return (
            <Autocomplete
                sx={{ width: "100%", margin: "0 0.25em" }}
                options={
                    (column as GridSingleSelectColDef<T>)
                        .valueOptions as readonly {
                        value: string;
                        label: string;
                    }[]
                }
                onChange={handleValueChange}
                value={value ? { value, label: formattedValue } : null}
                renderInput={(params) => (
                    <TextField {...params} margin="normal" variant="standard" />
                )}
                isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                }
            />
        );
    } satisfies GridSingleSelectColDef["renderEditCell"];
}

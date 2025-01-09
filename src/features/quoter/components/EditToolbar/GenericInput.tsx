import { FormControlLabel, Switch, TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";
import type { GridSingleSelectColDef, ValueOptions } from "@mui/x-data-grid";
import React from "react";
import type { ExtendedGridColDef } from "~/features/quoter/utils/types";

type GenericInputProps<T extends { id: string }> = {
    column: ExtendedGridColDef<T>;
    value: string;
    handleInputChange: (field: string, value: string) => void;
};

export default function GenericInput<T extends { id: string }>({
    column,
    value,
    handleInputChange,
}: GenericInputProps<T>) {
    switch (column.type) {
        case "string":
            return (
                <TextField
                    label={column.headerName}
                    required
                    fullWidth
                    margin="normal"
                    value={value}
                    onChange={(e) =>
                        handleInputChange(column.field, e.target.value)
                    }
                />
            );
        case "number":
            return (
                <TextField
                    label={column.headerName}
                    required
                    fullWidth
                    margin="normal"
                    value={value}
                    onChange={(e) =>
                        handleInputChange(column.field, e.target.value)
                    }
                    type="number"
                />
            );

            case "boolean": {
                if (value === "" || value === undefined) {
                    handleInputChange(column.field, String(false))
                    console.log(value)
                };
    
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={value === "1"}
                                onChange={(e) =>
                                    handleInputChange(
                                        column.field,
                                        String(Number(e.target.checked))
                                    )
                                }
                            />
                        }
                        label={column.headerName}
                    />
                );
            }
        case "singleSelect": {
            const options = (column as GridSingleSelectColDef)
                .valueOptions as readonly {
                value: string;
                label: string;
            }[];

            return (
                <Autocomplete
                    options={options}
                    onChange={(_e, newValue) =>
                        handleInputChange(column.field, newValue?.value || "")
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            label={column.headerName}
                            fullWidth
                            margin="normal"
                            value={value}
                        />
                    )}
                />
            );
        }
        default:
            return null;
    }
}

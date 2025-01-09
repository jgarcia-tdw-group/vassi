import {
    type GridRowId,
    GridRowModes,
    type GridRowModesModel,
} from "@mui/x-data-grid";
// useRowModes.ts
import { useState } from "react";

function useRowModes() {
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    return {
        rowModesModel,
        handleEditClick,
        handleSaveClick,
        handleCancelClick,
        handleRowModesModelChange,
    };
}

export { useRowModes };

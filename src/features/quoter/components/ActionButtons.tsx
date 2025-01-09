import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
// ActionButtons.tsx
import { GridActionsCellItem, type GridRowId } from "@mui/x-data-grid";

interface ActionButtonsProps {
    id: GridRowId;
    isInEditMode: boolean;
    onSave: () => void;
    onCancel: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function ActionButtons({
    id,
    isInEditMode,
    onSave,
    onCancel,
    onEdit,
    onDelete,
}: ActionButtonsProps) {
    if (isInEditMode) {
        return [
            <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                sx={{ color: "primary.main" }}
                onClick={onSave}
            />,
            <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={onCancel}
                color="inherit"
            />,
        ];
    }

    return [
        <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={onEdit}
            color="inherit"
        />,
        <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={onDelete}
            color="inherit"
        />,
    ];
}

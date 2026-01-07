import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface Props {
    onEdit?: () => void;
    onDelete?: () => void;
}

export function DataTableActions({ onEdit, onDelete }: Props) {
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {onEdit && (
                <Button
                    size="sm"
                    onClick={onEdit}
                    className="h-6 px-2 text-xs cursor-pointer"
                >
                    <PencilIcon className="cursor-pointer"/>
                    
                </Button>
            )}
            {onDelete && (
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onDelete}
                    className="h-6 px-2 text-xs cursor-pointer"
                >
                <Trash2Icon/>
                </Button>
            )}
        </div>
    );
}
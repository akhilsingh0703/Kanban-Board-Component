import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardType, ColumnType } from "../types";

type Props = {
    card: CardType;
    columnId: string;
    columns: ColumnType[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

const Card = ({ card, columnId, columns, setColumns }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const deleteCard = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag start
        const updated = columns.map((col) =>
            col.id === columnId
                ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
                : col
        );
        setColumns(updated);
    };

    const saveTitle = () => {
        setIsEditing(false);
        if (!title.trim()) {
            setTitle(card.title);
            return;
        }

        const updated = columns.map((col) =>
            col.id === columnId
                ? {
                    ...col,
                    cards: col.cards.map((c) =>
                        c.id === card.id ? { ...c, title } : c
                    ),
                }
                : col
        );
        setColumns(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            saveTitle();
        }
    };

    const getBorderClass = () => {
        if (columnId === "progress") return "progress-card";
        if (columnId === "done") return "done-card";
        return "";
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`card ${getBorderClass()}`}
        >
            <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    {isEditing ? (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={{
                                width: "100%",
                                padding: "4px",
                                marginRight: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px"
                            }}
                        />
                    ) : (
                        <span
                            onDoubleClick={() => setIsEditing(true)}
                            style={{ fontWeight: 500, cursor: "pointer", flexGrow: 1 }}
                        >
                            {card.title}
                        </span>
                    )}
                    <button
                        onClick={deleteCard}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                    >
                        <Trash2 size={16} className="delete" />
                    </button>

                </div>
                <div
                    style={{
                        width: "30px",
                        height: "6px",
                        background: "#e0e0e0",
                        borderRadius: "4px",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Card;

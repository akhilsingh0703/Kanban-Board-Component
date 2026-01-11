import { Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { ColumnType } from "../types";
import Card from "./Card";
import { v4 as uuid } from "uuid";

type Props = {
    column: ColumnType;
    columns: ColumnType[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

const Column = ({ column, columns, setColumns }: Props) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const addCard = () => {
        const title = prompt("Enter card title");
        if (!title) return;

        const updated = columns.map((col) =>
            col.id === column.id
                ? { ...col, cards: [...col.cards, { id: uuid(), title }] }
                : col
        );

        setColumns(updated);
    };

    return (
        <div className="column" ref={setNodeRef}>
            <div className={`column-header ${column.id}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>{column.title}</span>
                    <span style={{
                        background: "rgba(255,255,255,0.3)",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "12px"
                    }}>
                        {column.cards.length}
                    </span>
                </div>
                <Plus size={18} style={{ cursor: "pointer" }} onClick={addCard} />
            </div>

            <button className="add-btn" onClick={addCard}>+ Add Card</button>

            <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div style={{ padding: "0 10px", minHeight: "100px" }}>
                    {column.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            columnId={column.id}
                            columns={columns}
                            setColumns={setColumns}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

export default Column;

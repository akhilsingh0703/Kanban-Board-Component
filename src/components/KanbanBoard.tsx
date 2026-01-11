import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import "../App.css";
import type { ColumnType, CardType } from "../types";
import Column from "./Column";
import Card from "./Card";

const initialData: ColumnType[] = [
    {
        id: "todo",
        title: "Todo",
        cards: [{ id: "1", title: "Learn React" }],
    },
    {
        id: "progress",
        title: "In Progress",
        cards: [{ id: "2", title: "Build Kanban" }],
    },
    {
        id: "done",
        title: "Done",
        cards: [{ id: "3", title: "Setup Project" }],
    },
];

const KanbanBoard = () => {
    const [columns, setColumns] = useState(initialData);
    const [activeCard, setActiveCard] = useState<CardType | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findColumn = (id: string) => {
        return columns.find((col) => col.cards.some((card) => card.id === id))?.id || columns.find((col) => col.id === id)?.id;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id;
        const column = columns.find((col) => col.cards.some((c) => c.id === cardId));
        if (column) {
            const card = column.cards.find((c) => c.id === cardId);
            setActiveCard(card || null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeColumnId = findColumn(activeId as string);
        const overColumnId = findColumn(overId as string);

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

        setColumns((prev) => {
            const activeCol = prev.find((col) => col.id === activeColumnId);
            const overCol = prev.find((col) => col.id === overColumnId);

            if (!activeCol || !overCol) return prev;

            const activeCardIndex = activeCol.cards.findIndex((c) => c.id === activeId);
            const activeCard = activeCol.cards[activeCardIndex];

            // Remove from active column
            const newActiveCol = {
                ...activeCol,
                cards: [
                    ...activeCol.cards.slice(0, activeCardIndex),
                    ...activeCol.cards.slice(activeCardIndex + 1),
                ],
            };

            // Add to over column
            const newOverCol = {
                ...overCol,
                cards: [...overCol.cards, activeCard],
            };

            return prev.map((col) => {
                if (col.id === activeColumnId) return newActiveCol;
                if (col.id === overColumnId) return newOverCol;
                return col;
            });
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeColumnId = findColumn(activeId as string);
        const overColumnId = findColumn(overId as string);

        if (activeColumnId === overColumnId && activeColumnId) {
            const activeColIndex = columns.findIndex((col) => col.id === activeColumnId);
            const column = columns[activeColIndex];

            const oldIndex = column.cards.findIndex((c) => c.id === activeId);
            const newIndex = column.cards.findIndex((c) => c.id === overId);

            if (oldIndex !== newIndex) {
                setColumns((prev) => {
                    const updatedCol = {
                        ...column,
                        cards: arrayMove(column.cards, oldIndex, newIndex),
                    };
                    const newColumns = [...prev];
                    newColumns[activeColIndex] = updatedCol;
                    return newColumns;
                });
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="board">
                {columns.map((col) => (
                    <Column
                        key={col.id}
                        column={col}
                        columns={columns}
                        setColumns={setColumns}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeCard ? <Card card={activeCard} columnId="" columns={[]} setColumns={() => { }} /> : null}
            </DragOverlay>
        </DndContext>
    );
};



export default KanbanBoard;

import { Task } from '../domain';
import { SequenceIncrementor } from '../constants/SequenceConstants';
import { Column } from '../domain';

export const calculateSequenceNumber = (
  items: Task[] | Column[],
  index: number
): number => {
  if (index === 0 && items.length === 1) {
    return SequenceIncrementor;
  } else if (index === 0 && items.length > 1) {
    return items[1].seq / 2;
  } else if (index === items.length - 1) {
    return items[items.length - 2].seq + SequenceIncrementor;
  } else {
    const prevItemSeq = items[index - 1].seq;
    const nextItemSeq = items[index + 1].seq;
    return (prevItemSeq + nextItemSeq) / 2;
  }
};

export const reorder = (
  list: Task[],
  columnId: number,
  sourceIndex: number,
  destinationIndex: number
): Task => {
  const sourceClone = [...list.filter((item) => item.column_id === columnId)];

  const [movedTask] = sourceClone.splice(sourceIndex, 1);
  sourceClone.splice(destinationIndex, 0, movedTask);

  const seq = calculateSequenceNumber(sourceClone, destinationIndex);

  return { ...movedTask, seq };
};

export const reorderColumn = (
  list: Column[],
  sourceIndex: number,
  destinationIndex: number
) => {
  const sourceClone = [...list];

  const [movedColumn] = sourceClone.splice(sourceIndex, 1);
  sourceClone.splice(destinationIndex, 0, movedColumn);

  const seq = calculateSequenceNumber(sourceClone, destinationIndex);

  return { ...movedColumn, seq };
};

export const move = (
  list: Task[],
  sourceColumnId: number,
  destinationColumnId: number,
  sourceIndex: number,
  destinationIndex: number
): Task => {
  const sourceClone = [
    ...list.filter((item) => item.column_id === sourceColumnId),
  ];

  const destClone = [
    ...list.filter((item) => item.column_id === destinationColumnId),
  ];

  const [movedTask] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destinationIndex, 0, movedTask);

  const seq = calculateSequenceNumber(destClone, destinationIndex);

  return { ...movedTask, seq, column_id: destinationColumnId };
};

import { Task } from '../domain';
import { SequenceIncrementor } from '../constants/SequenceConstants';

export const calculateSequenceNumber = (
  tasks: Task[],
  index: number
): number => {
  if (index === 0 && tasks.length === 1) {
    return SequenceIncrementor;
  } else if (index === 0 && tasks.length > 1) {
    return tasks[1].seq / 2;
  } else if (index === tasks.length - 1) {
    return tasks[tasks.length - 2].seq + SequenceIncrementor;
  } else {
    const prevTaskSeq = tasks[index - 1].seq;
    const nextTaskSeq = tasks[index + 1].seq;
    return (prevTaskSeq + nextTaskSeq) / 2;
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

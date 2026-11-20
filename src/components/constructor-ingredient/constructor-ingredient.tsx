import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { moveIngredient, removeIngredient } from '@services/burger-constructor/slice';
import { useDispatch } from '@services/store';

import type { TConstructorIngredient } from '@utils/types';
import type { Identifier } from 'dnd-core';

import styles from './constructor-ingredient.module.css';

type TConstructorIngredientProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

type TSortableIngredient = {
  constructorId: string;
  index: number;
};

export const ConstructorIngredient = ({
  ingredient,
  index,
}: TConstructorIngredientProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'constructor-ingredient',
    item: (): TSortableIngredient => ({
      constructorId: ingredient.constructorId,
      index,
    }),
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<
    TSortableIngredient,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'constructor-ingredient',
    collect: (monitor): { handlerId: Identifier | null } => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor): void => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleRemove = (): void => {
    dispatch(removeIngredient(ingredient.constructorId));
  };

  return (
    <li
      className={styles.filling}
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <DragIcon type="primary" />
      <div className={styles.element}>
        <ConstructorElement
          text={ingredient.name}
          price={ingredient.price}
          thumbnail={ingredient.image}
          handleClose={handleRemove}
        />
      </div>
    </li>
  );
};

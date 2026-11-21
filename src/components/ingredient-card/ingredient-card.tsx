import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectIngredientCounts } from '@services/burger-constructor/slice';
import { useSelector } from '@services/store';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TIngredientCardProps): React.JSX.Element => {
  const counts = useSelector(selectIngredientCounts);
  const count = counts[ingredient._id] ?? 0;
  const location = useLocation();
  const navigate = useNavigate();

  const [{ isDragging }, dragRef] = useDrag({
    type: ingredient.type === 'bun' ? 'bun' : 'ingredient',
    item: ingredient,
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = (): void => {
    void navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.card}
        ref={(node): void => {
          dragRef(node);
        }}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={handleClick}
      >
        {count > 0 && <Counter count={count} size="default" extraClass="m-1" />}
        <img className={styles.image} alt={ingredient.name} src={ingredient.image} />
        <p className={`${styles.price} text text_type_digits-default`}>
          {ingredient.price}
          <CurrencyIcon type="primary" />
        </p>
        <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
      </button>
    </li>
  );
};

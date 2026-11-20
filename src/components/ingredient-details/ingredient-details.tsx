import { selectViewedIngredient } from '@services/ingredient-details/slice';
import { useSelector } from '@services/store';

import styles from './ingredient-details.module.css';

const nutrients = [
  { key: 'calories', title: 'Калории, ккал' },
  { key: 'proteins', title: 'Белки, г' },
  { key: 'fat', title: 'Жиры, г' },
  { key: 'carbohydrates', title: 'Углеводы, г' },
] as const;

export const IngredientDetails = (): React.JSX.Element | null => {
  const ingredient = useSelector(selectViewedIngredient);

  if (!ingredient) {
    return null;
  }

  return (
    <div className={styles.container}>
      <img className={styles.image} alt={ingredient.name} src={ingredient.image_large} />
      <div className={styles.description}>
        <p className="text text_type_main-medium">{ingredient.name}</p>
        <ul className={styles.nutrients}>
          {nutrients.map((nutrient) => (
            <li className={styles.nutrient} key={nutrient.key}>
              <p className="text text_type_main-default text_color_inactive">
                {nutrient.title}
              </p>
              <p className="text text_type_digits-default text_color_inactive">
                {ingredient[nutrient.key]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

const nutrients = [
  { key: 'calories', title: 'Калории, ккал' },
  { key: 'proteins', title: 'Белки, г' },
  { key: 'fat', title: 'Жиры, г' },
  { key: 'carbohydrates', title: 'Углеводы, г' },
] as const;

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
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

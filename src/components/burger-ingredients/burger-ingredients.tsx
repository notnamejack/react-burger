import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  bun: TIngredient | null;
  fillings: TConstructorIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

type TIngredientGroupProps = {
  title: string;
  items: TIngredient[];
  counts: Map<string, number>;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const IngredientGroup = ({
  title,
  items,
  counts,
  onIngredientClick,
}: TIngredientGroupProps): React.JSX.Element => {
  return (
    <>
      <p className="text text_type_main-medium mb-6">{title}</p>
      <ul className={styles.items}>
        {items.map((item) => {
          const count = counts.get(item._id) ?? 0;

          return (
            <li className={styles.item} key={item._id}>
              <button
                type="button"
                className={styles.card}
                onClick={() => {
                  onIngredientClick(item);
                }}
              >
                {count > 0 && <Counter count={count} size="default" extraClass="m-1" />}
                <img className={styles.image} alt={item.name} src={item.image} />
                <p className={`${styles.price} text text_type_digits-default`}>
                  {item.price}
                  <CurrencyIcon type="primary" />
                </p>
                <p className={`${styles.name} text text_type_main-default`}>
                  {item.name}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const BurgerIngredients = ({
  ingredients,
  bun,
  fillings,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');
  const bunRef = useRef<HTMLLIElement>(null);
  const sauceRef = useRef<HTMLLIElement>(null);
  const mainRef = useRef<HTMLLIElement>(null);

  const groupedIngredients = useMemo(
    () => ({
      bun: ingredients.filter((item) => item.type === 'bun'),
      sauce: ingredients.filter((item) => item.type === 'sauce'),
      main: ingredients.filter((item) => item.type === 'main'),
    }),
    [ingredients]
  );

  const ingredientCounts = useMemo(() => {
    const counts = new Map<string, number>();

    fillings.forEach((item) => {
      counts.set(item._id, (counts.get(item._id) ?? 0) + 1);
    });

    if (bun) {
      counts.set(bun._id, 2);
    }

    return counts;
  }, [bun, fillings]);

  const handleTabClick = useCallback((value: string): void => {
    setCurrentTab(value);

    const section = {
      bun: bunRef,
      sauce: sauceRef,
      main: mainRef,
    }[value];

    section?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>
      <ul className={`${styles.groups} custom-scroll`}>
        <li ref={bunRef}>
          <IngredientGroup
            title="Булки"
            items={groupedIngredients.bun}
            counts={ingredientCounts}
            onIngredientClick={onIngredientClick}
          />
        </li>
        <li className="mt-10" ref={sauceRef}>
          <IngredientGroup
            title="Соусы"
            items={groupedIngredients.sauce}
            counts={ingredientCounts}
            onIngredientClick={onIngredientClick}
          />
        </li>
        <li className="mt-10" ref={mainRef}>
          <IngredientGroup
            title="Начинки"
            items={groupedIngredients.main}
            counts={ingredientCounts}
            onIngredientClick={onIngredientClick}
          />
        </li>
      </ul>
    </section>
  );
};

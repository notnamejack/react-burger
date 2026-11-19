import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { useGetIngredientsQuery } from '@services/ingredients/api';

import type { TIngredient } from '@utils/types';
import type { RefObject } from 'react';

import styles from './burger-ingredients.module.css';

type TTabValue = 'bun' | 'main' | 'sauce';

type TIngredientGroupProps = {
  title: string;
  type: TTabValue;
  ingredients: TIngredient[];
  headingRef: RefObject<HTMLParagraphElement | null>;
};

type TTabSection = {
  value: TTabValue;
  node: HTMLParagraphElement | null;
};

const updateCurrentTab = (
  container: HTMLElement,
  sections: TTabSection[],
  setCurrentTab: (value: TTabValue) => void
): void => {
  const containerRect = container.getBoundingClientRect();
  const nearest = sections.reduce<{ value: TTabValue; distance: number } | null>(
    (closest, section) => {
      if (!section.node) {
        return closest;
      }

      const rect = section.node.getBoundingClientRect();
      const distance = Math.hypot(
        rect.left - containerRect.left,
        rect.top - containerRect.top
      );

      if (!closest || distance < closest.distance) {
        return { value: section.value, distance };
      }

      return closest;
    },
    null
  );

  if (nearest) {
    setCurrentTab(nearest.value);
  }
};

const IngredientGroup = ({
  title,
  type,
  ingredients,
  headingRef,
}: TIngredientGroupProps): React.JSX.Element => {
  const items = ingredients.filter((item) => item.type === type);

  return (
    <>
      <p className="text text_type_main-medium mb-6" ref={headingRef}>
        {title}
      </p>
      <ul className={styles.items}>
        {items.map((item) => (
          <IngredientCard ingredient={item} key={item._id} />
        ))}
      </ul>
    </>
  );
};

export const BurgerIngredients = (): React.JSX.Element => {
  const { data } = useGetIngredientsQuery();
  const ingredients = useMemo(() => data?.data ?? [], [data]);
  const [currentTab, setCurrentTab] = useState<TTabValue>('bun');
  const groupsRef = useRef<HTMLUListElement>(null);
  const bunHeadingRef = useRef<HTMLParagraphElement>(null);
  const sauceHeadingRef = useRef<HTMLParagraphElement>(null);
  const mainHeadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = groupsRef.current;

    if (!container) {
      return;
    }

    const handleScroll = (): void => {
      updateCurrentTab(
        container,
        [
          { value: 'bun', node: bunHeadingRef.current },
          { value: 'sauce', node: sauceHeadingRef.current },
          { value: 'main', node: mainHeadingRef.current },
        ],
        setCurrentTab
      );
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [ingredients]);

  const handleTabClick = (value: string): void => {
    const tab = value as TTabValue;
    const section = {
      bun: bunHeadingRef,
      sauce: sauceHeadingRef,
      main: mainHeadingRef,
    }[tab];

    setCurrentTab(tab);
    section.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <ul className={`${styles.groups} custom-scroll`} ref={groupsRef}>
        <li>
          <IngredientGroup
            title="Булки"
            type="bun"
            ingredients={ingredients}
            headingRef={bunHeadingRef}
          />
        </li>
        <li className="mt-10">
          <IngredientGroup
            title="Соусы"
            type="sauce"
            ingredients={ingredients}
            headingRef={sauceHeadingRef}
          />
        </li>
        <li className="mt-10">
          <IngredientGroup
            title="Начинки"
            type="main"
            ingredients={ingredients}
            headingRef={mainHeadingRef}
          />
        </li>
      </ul>
    </section>
  );
};

import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { ConstructorIngredient } from '@components/constructor-ingredient/constructor-ingredient';
import { selectIsAuthChecked, selectUser } from '@services/auth/slice';
import {
  addIngredient,
  clearConstructor,
  selectBun,
  selectConstructorIngredients,
  selectTotalPrice,
  setBun,
} from '@services/burger-constructor/slice';
import { useCreateOrderMutation } from '@services/order/api';
import { setOrder } from '@services/order/slice';
import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

const dropIngredient = (
  item: TIngredient,
  dispatch: ReturnType<typeof useDispatch>
): void => {
  if (item.type === 'bun') {
    dispatch(setBun(item));
    return;
  }

  dispatch(addIngredient(item));
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const totalPrice = useSelector(selectTotalPrice);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [hasOrderError, setHasOrderError] = useState(false);
  const topBunRef = useRef<HTMLDivElement>(null);
  const bottomBunRef = useRef<HTMLDivElement>(null);
  const fillingsRef = useRef<HTMLUListElement>(null);

  const [{ isOver: isTopBunOver }, topBunDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: 'bun',
    collect: (monitor): { isOver: boolean } => ({
      isOver: monitor.isOver(),
    }),
    drop: (item): void => {
      dropIngredient(item, dispatch);
    },
  });

  const [{ isOver: isBottomBunOver }, bottomBunDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: 'bun',
    collect: (monitor): { isOver: boolean } => ({
      isOver: monitor.isOver(),
    }),
    drop: (item): void => {
      dropIngredient(item, dispatch);
    },
  });

  const [{ isOver: isFillingOver }, fillingsDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: 'ingredient',
    collect: (monitor): { isOver: boolean } => ({
      isOver: monitor.isOver(),
    }),
    drop: (item): void => {
      dropIngredient(item, dispatch);
    },
  });

  topBunDrop(topBunRef);
  bottomBunDrop(bottomBunRef);
  fillingsDrop(fillingsRef);

  const handleOrderClick = async (): Promise<void> => {
    if (!bun || !isAuthChecked) {
      return;
    }

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [bun._id, ...ingredients.map((item) => item._id), bun._id];

    try {
      const result = await createOrder(ingredientIds).unwrap();

      if (!result.success) {
        setHasOrderError(true);
        return;
      }

      setHasOrderError(false);
      dispatch(setOrder(result));
      dispatch(clearConstructor());
    } catch {
      setHasOrderError(true);
    }
  };

  const topPlaceholderClass = `${styles.placeholder} ${styles.placeholder_top} ${
    isTopBunOver ? styles.placeholder_active : ''
  }`;
  const bottomPlaceholderClass = `${styles.placeholder} ${styles.placeholder_bottom} ${
    isBottomBunOver ? styles.placeholder_active : ''
  }`;
  const fillingPlaceholderClass = `${styles.placeholder} ${
    isFillingOver ? styles.placeholder_active : ''
  }`;

  return (
    <section className={`${styles.burger_constructor} mt-25`}>
      <div className={styles.body}>
        <div className={styles.edge} ref={topBunRef}>
          {bun ? (
            <div className={styles.element}>
              <ConstructorElement
                type="top"
                isLocked
                text={`${bun.name} (верх)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          ) : (
            <div className={topPlaceholderClass}>
              <p className="text text_type_main-default">Выберите булки</p>
            </div>
          )}
        </div>
        <ul className={`${styles.fillings} custom-scroll`} ref={fillingsRef}>
          {ingredients.length === 0 ? (
            <li className={styles.placeholder_row}>
              <div className={fillingPlaceholderClass}>
                <p className="text text_type_main-default">Выберите начинку</p>
              </div>
            </li>
          ) : (
            ingredients.map((item, index) => (
              <ConstructorIngredient
                ingredient={item}
                index={index}
                key={item.constructorId}
              />
            ))
          )}
        </ul>
        <div className={styles.edge} ref={bottomBunRef}>
          {bun ? (
            <div className={styles.element}>
              <ConstructorElement
                type="bottom"
                isLocked
                text={`${bun.name} (низ)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          ) : (
            <div className={bottomPlaceholderClass}>
              <p className="text text_type_main-default">Выберите булки</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={`${styles.total} text text_type_digits-medium`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </p>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={() => {
            void handleOrderClick();
          }}
          disabled={!bun || isLoading}
        >
          Оформить заказ
        </Button>
      </div>
      {hasOrderError && (
        <p className={`${styles.error} text text_type_main-default`}>
          Не удалось оформить заказ
        </p>
      )}
    </section>
  );
};

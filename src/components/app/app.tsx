import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients as requestIngredients } from '@utils/api';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './app.module.css';

const FILLINGS_COUNT = 8;

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [bun, setBun] = useState<TIngredient | null>(null);
  const [fillings, setFillings] = useState<TConstructorIngredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (ingredients.length === 0) {
      getIngredients();
    }
  }, []);

  const getIngredients = (): void => {
    requestIngredients()
      .then((result) => {
        setIngredients(result.data);
      })
      .catch(() => {
        setHasError(true);
      });
  };

  useEffect(() => {
    if (ingredients.length === 0 || fillings.length > 0) {
      return;
    }

    setBun(ingredients.find((item) => item.type === 'bun') ?? null);
    setFillings(
      ingredients
        .filter((item) => item.type !== 'bun')
        .slice(0, FILLINGS_COUNT)
        .map((item) => ({
          ...item,
          constructorId: crypto.randomUUID(),
        }))
    );
  }, [ingredients]);

  const totalPrice = useMemo(() => {
    const fillingsPrice = fillings.reduce((sum, item) => sum + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;

    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  const handleIngredientClick = useCallback((ingredient: TIngredient): void => {
    setIsOrderOpen(false);
    setSelectedIngredient(ingredient);
  }, []);

  const handleOrderClick = useCallback((): void => {
    setSelectedIngredient(null);
    setIsOrderOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setSelectedIngredient(null);
    setIsOrderOpen(false);
  }, []);

  const handleRemoveFilling = useCallback((constructorId: string): void => {
    setFillings((currentFillings) =>
      currentFillings.filter((item) => item.constructorId !== constructorId)
    );
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        {hasError ? (
          <p className="text text_type_main-default">Не удалось загрузить ингредиенты</p>
        ) : (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              bun={bun}
              fillings={fillings}
              onIngredientClick={handleIngredientClick}
            />
            <BurgerConstructor
              bun={bun}
              fillings={fillings}
              totalPrice={totalPrice}
              onRemoveFilling={handleRemoveFilling}
              onOrderClick={handleOrderClick}
            />
          </>
        )}
      </main>
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;

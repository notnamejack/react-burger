import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  clearViewedIngredient,
  selectViewedIngredient,
} from '@services/ingredient-details/slice';
import { useGetIngredientsQuery } from '@services/ingredients/api';
import { clearOrder, selectOrder } from '@services/order/slice';
import { useDispatch, useSelector } from '@services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isError } = useGetIngredientsQuery();
  const viewedIngredient = useSelector(selectViewedIngredient);
  const order = useSelector(selectOrder);

  const handleCloseIngredient = useCallback((): void => {
    dispatch(clearViewedIngredient());
  }, [dispatch]);

  const handleCloseOrder = useCallback((): void => {
    dispatch(clearOrder());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        {isError ? (
          <p className="text text_type_main-default">Не удалось загрузить ингредиенты</p>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients />
            <BurgerConstructor />
          </DndProvider>
        )}
      </main>
      {viewedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredient}>
          <IngredientDetails />
        </Modal>
      )}
      {order && (
        <Modal onClose={handleCloseOrder}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;

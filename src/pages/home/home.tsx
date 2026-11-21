import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useGetIngredientsQuery } from '@services/ingredients/api';
import { clearOrder, selectOrder } from '@services/order/slice';
import { useDispatch, useSelector } from '@services/store';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isError } = useGetIngredientsQuery();
  const order = useSelector(selectOrder);

  const handleCloseOrder = useCallback((): void => {
    dispatch(clearOrder());
  }, [dispatch]);

  return (
    <div className={styles.home}>
      {isError ? (
        <p className="text text_type_main-default">Не удалось загрузить ингредиенты</p>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients />
          <BurgerConstructor />
        </DndProvider>
      )}
      {order && (
        <Modal onClose={handleCloseOrder}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

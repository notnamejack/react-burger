import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { selectOrder } from '@services/order/slice';
import { useSelector } from '@services/store';

import doneImage from '../../assets/images/done.svg';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element | null => {
  const order = useSelector(selectOrder);

  if (!order) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.number}>
        <p className={`${styles.order} text text_type_digits-large`}>
          {order.order.number}
        </p>
        <p className="text text_type_main-medium">идентификатор заказа</p>
      </div>
      <div className={styles.image}>
        <img className={styles.glow} src={doneImage} alt="" />
        <div className={styles.icon}>
          <CheckMarkIcon type="primary" />
        </div>
      </div>
      <div className={styles.status}>
        <p className="text text_type_main-default">Ваш заказ начали готовить</p>
        <p className="text text_type_main-default text_color_inactive">
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    </div>
  );
};

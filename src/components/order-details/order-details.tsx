import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import doneImage from '../../assets/images/done.svg';

import styles from './order-details.module.css';

const ORDER_NUMBER = '034536';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.number}>
        <p className={`${styles.order} text text_type_digits-large`}>{ORDER_NUMBER}</p>
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

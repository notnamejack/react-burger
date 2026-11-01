import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun: TIngredient | null;
  fillings: TConstructorIngredient[];
  totalPrice: number;
  onRemoveFilling: (constructorId: string) => void;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  bun,
  fillings,
  totalPrice,
  onRemoveFilling,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section className={`${styles.burger_constructor} mt-25`}>
      <div className={styles.body}>
        <div className={styles.edge}>
          {bun && (
            <div className={styles.element}>
              <ConstructorElement
                type="top"
                isLocked
                text={`${bun.name} (верх)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          )}
        </div>
        <ul className={`${styles.fillings} custom-scroll`}>
          {fillings.map((item) => (
            <li className={styles.filling} key={item.constructorId}>
              <DragIcon type="primary" />
              <div className={styles.element}>
                <ConstructorElement
                  text={item.name}
                  price={item.price}
                  thumbnail={item.image}
                  handleClose={() => {
                    onRemoveFilling(item.constructorId);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.edge}>
          {bun && (
            <div className={styles.element}>
              <ConstructorElement
                type="bottom"
                isLocked
                text={`${bun.name} (низ)`}
                price={bun.price}
                thumbnail={bun.image}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <p className={`${styles.total} text text_type_digits-medium`}>
          {totalPrice}
          <CurrencyIcon type="primary" />
        </p>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

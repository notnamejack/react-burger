export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TMessageResponse = {
  success: boolean;
  message: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = TLoginRequest & {
  name: string;
};

export type TForgotRequest = {
  email: string;
};

export type TResetRequest = {
  password: string;
  token: string;
};

export type TUpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};

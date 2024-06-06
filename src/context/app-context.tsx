import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { TProduct } from '@/types/common-types.ts';

export type Product = TProduct;

export type Cart = Record<number, Product>;

type TAppProvider = {
  children: ReactNode
};

type AppContextProviderValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  clearCart: () => void;
}

const initialContext = {
  cart: {},
  addProduct: () => {
  },
  removeProduct: () => {
  },
  clearCart: () => {
  }
};

const AppContext = createContext<AppContextProviderValue>(initialContext);

export const AppProvider = ({ children }: TAppProvider) => {
  const [cart, setCart] = useState<Cart>({});

  const addProduct = useCallback((product: Product) => {
    setCart((previousState) => {
      if (!(product.id in previousState)) {
        return { ...previousState, [product.id]: { ...product, quantity: 1 } };
      }

      const previousQuantity = previousState[product.id].quantity;

      return {
        ...previousState,
        [product.id]: { ...product, quantity: previousQuantity + 1 }
      };
    });
  }, []);

  const removeProduct = useCallback((product: Product) => {
    setCart((previousState) => {
      if (!(product.id in previousState)) {
        return previousState;
      }

      const newQuantity = previousState[product.id].quantity - 1;

      if (newQuantity > 0) {
        return { ...previousState, [product.id]: { ...product, quantity: newQuantity } };
      }

      return Object.keys(previousState)
        .filter(key => key !== String(product.id))
        .reduce((accumulator, key) => ({
          ...accumulator,
          [key]: previousState[Number(key)]
        }), {});
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  return (
    <AppContext.Provider value={{ cart, clearCart, addProduct, removeProduct }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

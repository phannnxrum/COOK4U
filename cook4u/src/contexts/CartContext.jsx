import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    chef: null,
    dishes: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/cart/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = res.data.data;
        
        // Cập nhật state trực tiếp, KHÔNG gọi addChef/addDish
        setCart({
          chef: data.chef || null,
          dishes: data.dishes || []
        });
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addChef = async (chef) => {
    try {
      const chefId = chef.CHEFID || chef.id;
      
      await axios.post("http://localhost:3000/api/cart/chef", 
        { chefId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Cập nhật state
      setCart(prev => ({
        ...prev,
        chef: {
          CHEFID: chefId,
          CHEFNAME: chef.CHEFNAME || chef.name,
          AVTURL: chef.AVTURL || chef.avatar,
          price: chef.PRICEPERHOUR || chef.price,
          // rating: chef.rating,
          // reviews: chef.reviews
        }
      }));
    } catch (error) {
      console.error("Error adding chef:", error);
      throw error;
    }
  };

  const removeChef = async () => {
    try {
      await axios.delete("http://localhost:3000/api/cart/chef", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCart(prev => ({
        ...prev,
        chef: null
      }));
    } catch (error) {
      console.error("Error removing chef:", error);
      throw error;
    }
  };

  const addDish = async (dish, quantity = 1) => {
    try {
      const dishId = dish.DISHID || dish.id;
      
      await axios.post("http://localhost:3000/api/cart/dish",
        { dishId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Kiểm tra xem món đã có trong giỏ chưa
      setCart(prev => {
        const existingIndex = prev.dishes.findIndex(d => d.DISHID === dishId);
        
        if (existingIndex >= 0) {
          // Cập nhật số lượng nếu đã có
          const updatedDishes = [...prev.dishes];
          updatedDishes[existingIndex] = {
            ...updatedDishes[existingIndex],
            QUANTITY: (updatedDishes[existingIndex].QUANTITY || 1) + quantity
          };
          return { ...prev, dishes: updatedDishes };
        } else {
          // Thêm mới
          return {
            ...prev,
            dishes: [...prev.dishes, {
              DISHID: dishId,
              DISHNAME: dish.DISHNAME || dish.name,
              PICTUREURL: dish.PICTUREURL || dish.image,
              COOKTIME: dish.COOKTIME,
              PRICE: dish.PRICE || dish.price,
              NUMPEOPLE: dish.NUMPEOPLE,
              QUANTITY: quantity
            }]
          };
        }
      });
    } catch (error) {
      console.error("Error adding dish:", error);
      throw error;
    }
  };

  const removeDish = async (dishId) => {
    try {
      await axios.delete("http://localhost:3000/api/cart/dish", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: { dishId }
      });

      setCart(prev => ({
        ...prev,
        dishes: prev.dishes.filter(dish => dish.DISHID !== dishId)
      }));
    } catch (error) {
      console.error("Error removing dish:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:3000/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCart({
        chef: null,
        dishes: []
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const getCartCount = () => {
    let count = 0;
    if (cart.chef) count += 1;
    count += cart.dishes.length;
    return count;
  };

  const value = {
    cart,
    addChef,
    removeChef,
    addDish,
    removeDish,
    clearCart,
    getCartCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
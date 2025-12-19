import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const currentTokenRef = useRef(localStorage.getItem("token"));

  // Fetch giỏ hàng từ API khi token thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No token, clearing cart");
        setCart({
          chef: null,
          dishes: []
        });
        setLoading(false);
        return;
      }

      // Nếu token giống token trước đó, không fetch lại
      if (token === currentTokenRef.current && cart.dishes.length > 0) {
        console.log("Same token, skip refetch");
        return;
      }

      // Cập nhật token hiện tại
      currentTokenRef.current = token;

      try {
        setLoading(true);
        console.log("Fetching cart for user with token:", token.substring(0, 20) + "...");
        
        const res = await axios.get("http://localhost:3000/api/cart/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data.data;
        console.log("Cart data from API:", data);
        
        // Cập nhật state trực tiếp
        setCart({
          chef: data.chef || null,
          dishes: data.dishes || []
        });
      } catch (error) {
        console.error("Error fetching cart:", error);
        // Nếu lỗi 401 (unauthorized), clear cart
        if (error.response?.status === 401) {
          setCart({
            chef: null,
            dishes: []
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [fetchTrigger]); // Refetch khi fetchTrigger thay đổi

  // Lắng nghe sự kiện đăng xuất/đăng nhập
  useEffect(() => {
    // Hàm xử lý khi storage thay đổi
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log("Token changed, triggering cart refetch");
        setFetchTrigger(prev => prev + 1); // Trigger refetch
      }
    };

    // Lắng nghe sự kiện storage (từ tab khác)
    window.addEventListener('storage', handleStorageChange);
    
    // Kiểm tra token mỗi giây (cho cùng tab)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== currentTokenRef.current) {
        console.log("Token changed in same tab");
        handleStorageChange({ key: 'token' });
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Function để manual refetch cart
  const refreshCart = () => {
    setFetchTrigger(prev => prev + 1);
  };

  const addChef = async (chef) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      }

      const chefId = chef.CHEFID || chef.id;
      
      console.log("Adding chef:", chefId, "for user with token:", token.substring(0, 20) + "...");
      
      await axios.post("http://localhost:3000/api/cart/chef", 
        { chefId },
        {
          headers: {
            Authorization: `Bearer ${token}`
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
        }
      }));
    } catch (error) {
      console.error("Error adding chef:", error);
      throw error;
    }
  };

  const removeChef = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("http://localhost:3000/api/cart/chef", {
        headers: {
          Authorization: `Bearer ${token}`
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      }

      const dishId = dish.DISHID || dish.id;
      
      console.log("Adding dish:", dishId, "for user with token:", token.substring(0, 20) + "...");
      
      await axios.post("http://localhost:3000/api/cart/dish",
        { dishId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Cập nhật state
      setCart(prev => {
        const existingIndex = prev.dishes.findIndex(d => d.DISHID === dishId);
        
        if (existingIndex >= 0) {
          const updatedDishes = [...prev.dishes];
          updatedDishes[existingIndex] = {
            ...updatedDishes[existingIndex],
            QUANTITY: (updatedDishes[existingIndex].QUANTITY || 1) + quantity
          };
          return { ...prev, dishes: updatedDishes };
        } else {
          return {
            ...prev,
            dishes: [...prev.dishes, {
              DISHID: dishId,
              DISHNAME: dish.DISHNAME || dish.name,
              PICTUREURL: dish.PICTUREURL || dish.image,
              COOKTIME: dish.COOKTIME || dish.cookTime,
              PRICE: dish.PRICE || dish.price,
              NUMPEOPLE: dish.NUMPEOPLE || dish.servings,
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
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("http://localhost:3000/api/cart/dish", {
        headers: {
          Authorization: `Bearer ${token}`
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
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete("http://localhost:3000/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`
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

  // Clear cart khi đăng xuất (gọi từ AuthContext)
  const resetCart = () => {
    console.log("Resetting cart...");
    setCart({
      chef: null,
      dishes: []
    });
    currentTokenRef.current = null;
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
    loading,
    refreshCart,
    resetCart // Thêm function này
  };

  useEffect(() => {
  window.resetCart = resetCart;
  return () => {
    delete window.resetCart;
  };
}, []);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
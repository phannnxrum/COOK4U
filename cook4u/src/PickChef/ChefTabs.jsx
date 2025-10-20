import React from "react";
import ChefFavoriteDishes from "./ChefFavoriteDishes";
import { useState } from "react";
import ChefIntro from "./ChefIntro";
import ChefFeedback from "./ChefFeedback";

const ChefTabs = ({ chef }) => {
  const [activeTabs, setActiveTabs] = useState("fDishes");
  const tabs = [
    { id: "fDishes", label: "Món ăn sở trường" },
    { id: "intro", label: "Giới thiệu" },
    { id: "feedback", label: "Đánh giá" },
  ];
  const activeIndex = tabs.findIndex((t) => t.id === activeTabs);

  return (
    <div className="bg-white px-5">
      <div className="flex justify-center px-1 bg-gray-100 py-1 rounded-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabs(tab.id)}
            className={`inline-block py-1.5 w-1/3 rounded-full font-semibold transition-all duration-200 ${
              activeTabs === tab.id
                ? "bg-white shadow-md text-orange-500 font-medium"
                : "text-gray-700 hover:text-orange-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* --- Nội dung thay đổi phía dưới --- */}
      <div className="">
        {activeTabs === "fDishes" && (
          <ChefFavoriteDishes dishes={chef.dishes}></ChefFavoriteDishes>

        )}

        {activeTabs === "intro" && (
            <ChefIntro chef = {chef}></ChefIntro>
        )}

        {activeTabs === "feedback" && (
          <ChefFeedback reviewLists={chef.reviewsList}></ChefFeedback>
        )}
      </div>
    </div>
  );
};

export default ChefTabs;

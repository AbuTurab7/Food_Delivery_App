import { useState } from "react";
import { GiThornedArrow } from "react-icons/gi";
import { IoSearchOutline } from "react-icons/io5";
import MenuAccordian from "./MenuAccordian";
import RestFilter from "./RestFilter";
import "./menu.css";

export default function Menu({ menu, restInfo }) {
  const [isVegOn, setVegOn] = useState(false);
  const [isNonVegOn, setNonVegOn] = useState(false);
  const [isBestsellerOn, setBestsellerOn] = useState(false);

  const filteredMenu = menu
    ?.map((section) => {
      let card = section.card.card;

      // filter itemCards
      if (card?.itemCards) {
        const filteredItems = card.itemCards.filter((item) => {
          const info = item?.card?.info;
          if (isVegOn && info?.itemAttribute?.vegClassifier !== "VEG") return false;
          if (isNonVegOn && info?.itemAttribute?.vegClassifier !== "NONVEG") return false;
          if (isBestsellerOn && !info?.isBestseller) return false;
          return true;
        });
        return filteredItems.length > 0 ? { ...section, card: { ...section.card, card: { ...card, itemCards: filteredItems } } } : null;
      }

      // filter nested categories
      if (card?.categories) {
        const filteredCategories = card.categories
          .map((cat) => {
            const filteredItems = cat.itemCards.filter((item) => {
              const info = item?.card?.info;
              if (isVegOn && info?.itemAttribute?.vegClassifier !== "VEG") return false;
              if (isNonVegOn && info?.itemAttribute?.vegClassifier !== "NONVEG") return false;
              if (isBestsellerOn && !info?.isBestseller) return false;
              return true;
            });
            return filteredItems.length > 0 ? { ...cat, itemCards: filteredItems } : null;
          })
          .filter(Boolean); 

        return filteredCategories.length > 0
          ? { ...section, card: { ...section.card, card: { ...card, categories: filteredCategories } } }
          : null;
      }

      return section;
    })
    .filter(Boolean); 

  return (
    <div className="restaurant-menu-container">
      <div className="restaurant-menu-header">
        <GiThornedArrow id="left" />
        <p style={{ fontSize: "13px" }}>MENU</p>
        <GiThornedArrow id="right" />
      </div>

      <div className="restaurant-menu-search-container">
        <div className="restaurant-menu-search">
          <div className="restaurant-menu-search-text">
            <p style={{ fontSize: "14px" }}>Search for dishes</p>
          </div>
          <IoSearchOutline />
        </div>
      </div>

      <div className="restaurant-menu-filter-container">
        <RestFilter
          isVegOn={isVegOn}
          setVegOn={setVegOn}
          isNonVegOn={isNonVegOn}
          setNonVegOn={setNonVegOn}
          isBestsellerOn={isBestsellerOn}
          setBestsellerOn={setBestsellerOn}
        />
      </div>

      <div className="restaurant-menu-card-container">
        <MenuAccordian menuData={filteredMenu} restInfo={restInfo} />
      </div>
    </div>
  );
}

import "./RestFilter.css";

export default function RestFilter({
  isVegOn,
  setVegOn,
  isNonVegOn,
  setNonVegOn,
  isBestsellerOn,
  setBestsellerOn,
}) {
  return (
    <div className="RestFilter-main-container">
      <div className="RestFilter-Inside-container">
        <div
          className={`RestFilter-container ${isVegOn ? "active" : ""}`}
          onClick={() => {
            setVegOn(!isVegOn);
            setNonVegOn(false);
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Veg_symbol.svg/180px-Veg_symbol.svg.png"
            alt="VEG"
            height={"20px"}
            width={"20px"}
            className={`${isVegOn ? "On" : "off"}`}
          />
        </div>

        <div
          className={`RestFilter-container ${isNonVegOn ? "active" : ""}`}
          onClick={() => {
            setNonVegOn(!isNonVegOn);
            setVegOn(false);
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Non_veg_symbol.svg/180px-Non_veg_symbol.svg.png"
            alt="NON VEG"
            height={"20px"}
            width={"20px"}
            className={`${isNonVegOn ? "On" : "off"}`}
          />
        </div>

        <div
          className={`RestFilter-container ${isBestsellerOn ? "active" : ""}`}
          onClick={() => setBestsellerOn(!isBestsellerOn)}
        >
          <p>Bestseller</p>
        </div>
      </div>
    </div>
  );
}

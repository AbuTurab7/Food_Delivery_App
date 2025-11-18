import Offcanvas from "react-bootstrap/Offcanvas";
import { GoLocation } from "react-icons/go";
import "./offCanvas.css";
import { useContext, useState } from "react";
import { Coordinates } from "./ContextApi";

export default function LocationOffcanvas({
  show,
  handleClose,
  handleAddress,
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [recentSearch, setRecentSearch] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const { setCoords } = useContext(Coordinates);


  async function fetchSearches(val) {
    try {
      if (!val) return;
      const res = await fetch(
        `https://swiggy-netfily-proxy.netlify.app/.netlify/functions/swiggy?type=autocomplete&input=${val}`
      );
      const result = await res.json();
      setSearchData(result?.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCoords(id) {
    try {
      if (!id) return;
      const res = await fetch(
        `https://swiggy-netfily-proxy.netlify.app/.netlify/functions/swiggy?type=address-recommend&place_id=${id}`
      );
      const result = await res.json();
      const loc = result?.data[0]?.geometry.location;
      if (loc) {
        setCoords({ lat: loc.lat, lng: loc.lng });
      }
      const formatted = result?.data[0]?.formatted_address;
      if (formatted) handleAddress(formatted);
    } catch (error) {
      console.log(error);
    }
  }

  function setRecentSearchData(value) {
    setRecentSearch((prev) => {
      const filtered = prev.filter((item) => item.place_id !== value.place_id);

      const updated = [value, ...filtered].slice(0, 4);

      localStorage.setItem("recentSearches", JSON.stringify(updated));

      return updated;
    });
  }

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      className="custom-offcanvas location-offcanvas"
      placement="start"
    >
      <Offcanvas.Header closeButton></Offcanvas.Header>
      <Offcanvas.Body>
        <div className="offCanvas-main-container">
          <div className="offCanvas-input-container">
            <input
              id="offCanvas-input"
              type="text"
              value={inputValue}
              placeholder="Search for area, street name..."
              onChange={(e) => {
                fetchSearches(e.target.value);
                setInputValue(e.target.value);
              }}
            />
            {inputValue && (
              <button id="cancel-btn" onClick={() => setInputValue("")}>
                Cancel
              </button>
            )}
          </div>

          {inputValue ? (
            <div className="offCanvas-result-container">
              {!searchData.length ? (
                <div className="loader"></div>
              ) : (
                <ul>
                  {searchData.map((search, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        console.log(search);
                        setRecentSearchData(search);
                        setInputValue("");
                        fetchCoords(search?.place_id);
                      }}
                    >
                      <div className="result-icon-container">
                        <GoLocation />
                      </div>
                      <div className="result-description" onClick={handleClose}>
                        <p id="cityName">
                          {search?.structured_formatting?.main_text}
                        </p>
                        <p className="secondary-text">
                          {search?.structured_formatting?.secondary_text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Recent searches */
            <div
              className={`offCanvas-result-container ${
                recentSearch?.length > 0 ? "border" : ""
              }`}
            >
              {!recentSearch ? (
                <div className="loader"></div>
              ) : (
                <>
                  <ul>
                    {recentSearch?.length > 0 && (
                      <p id="result">RECENT SEARCHES</p>
                    )}
                    {recentSearch.map((search, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          console.log(search);
                          fetchCoords(search?.place_id);
                        }}
                      >
                        <div className="result-icon-container">
                          <GoLocation />
                        </div>
                        <div
                          className="result-description"
                          onClick={handleClose}
                        >
                          <p id="cityName">
                            {search?.structured_formatting?.main_text}
                          </p>
                          <p className="secondary-text">
                            {search?.structured_formatting?.secondary_text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

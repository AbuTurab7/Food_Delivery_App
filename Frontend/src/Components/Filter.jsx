import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Modal from "react-bootstrap/Modal";
import { MdClear } from "react-icons/md";
import { useState, useEffect } from "react";
import "./filter.css";
import { useDispatch } from "react-redux";
import { setFilterValue } from "../Utilities/filterSlice";
import toast from "react-hot-toast";

export default function Filter({ FilterData }) {
  const [modalShow, setModalShow] = useState(false);
  const [markerVal, setMarkerVal] = useState(0);
  const [tabVal, setTabVal] = useState(-1);
  const [applyBtn, setApplyBtn] = useState(true);
  const [activeBtn, setActiveBtn] = useState(null);

  const filterOptions = [
    "Ratings 4.0+",
    "Rs. 300-Rs. 600",
    "Offers",
    "Less than Rs. 300",
  ];

  const dispatch = useDispatch();

  const filteredData =
  FilterData?.facetList?.filter((data) => data.facetInfo) || [];

  function handleMarker(i) {
    setMarkerVal(i * 80);
  }

  function handleFilterBtn(filterName) {
    setActiveBtn(activeBtn === filterName ? null : filterName);
  }

  useEffect(() => {
    dispatch(setFilterValue(activeBtn));
  }, [activeBtn, dispatch]);

  function handleApply() {
    toast.success("Filter Applied");
    setApplyBtn(true);
  }

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="filter-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <p
              style={{
                fontSize: "24px",
                color: "#02060CBF",
                fontWeight: "650",
              }}
            >
              Filter
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{ transform: `translateY(${markerVal}%)` }}
            className="modal-click-marker"
          ></div>
          <div className="modal-body-container">
            <div className="filter-modal-buttons-container">
              <div
                className="filter-modal-button"
                onClick={() => {
                  handleMarker(0);
                  setTabVal(-1);
                }}
              >
                <p>Sort</p>
              </div>
              {filteredData?.map((btn, i) => (
                <div
                  key={i}
                  className="filter-modal-button"
                  onClick={() => {
                    handleMarker(i + 1);
                    setTabVal(i);
                  }}
                >
                  <p>{btn.label}</p>
                </div>
              ))}
            </div>
            <div className="filter-modal-data-container">
              {tabVal === -1 ? (
                <div className="filter-modal-sort-data">
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#02060C99",
                    }}
                  >
                    SORT BY
                  </p>
                  {FilterData?.sortConfigs?.map((item, i) => (
                    <label key={i}>
                      <div className="filter-modal-item-list">
                        <input
                          style={{
                            accentColor: "orangered",
                            cursor: "pointer",
                          }}
                          onChange={(e) => {
                            setApplyBtn(false);
                          }}
                          type="radio"
                          name="list"
                          id="list"
                          defaultChecked={i === 0}
                        />
                        <p
                          style={{
                            fontSize: "16px",
                            color: "#02060CBF",
                          }}
                        >
                          {item?.title}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="filter-modal-sort-data">
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#02060C99",
                    }}
                  >
                    FILTER BY
                  </p>
                  {filteredData[tabVal]?.facetInfo?.map((info, i) => (
                    <label key={i}>
                      <div className="filter-modal-item-list">
                        <input
                          style={{
                            accentColor: "orangered",
                            cursor: "pointer",
                          }}
                          onChange={() => setApplyBtn(false)}
                          type="radio"
                          name="list"
                          id="list"
                        />
                        <p
                          style={{
                            fontSize: "16px",
                            color: "#02060CBF",
                          }}
                        >
                          {info?.label}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`modal-filter-btn ${applyBtn ? "hide" : ""}`}>
            <button id="clear-filter-btn">Clear Filters</button>
            <button id="apply-filter-btn" onClick={handleApply}>
              Apply
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div className="filter-main-container">
      <div className="filter-inside-container">
        <div className="filter-container" onClick={() => setModalShow(true)}>
          <p>Filter</p>
          <HiOutlineAdjustmentsHorizontal />
        </div>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setApplyBtn(true);
          }}
        />
        {filterOptions.map((filter, i) => (
          <div
            onClick={() => handleFilterBtn(filter)}
            className={`filter-container ${
              activeBtn === filter ? "Active" : ""
            }`}
            key={i}
          >
            <p>{filter}</p>
            <MdClear
              className="crossIcon"
              onClick={(e) => {
                e.stopPropagation();
                setActiveBtn(null);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

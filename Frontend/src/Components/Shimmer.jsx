import "./shimmer.css";

export default function Shimmer() {

  return (
    <div className="shimmer-main-container">
      <div className="upper-shimmer">
        <div className="shimmer-img-container">
          <img
            height={"50px"}
            width={"50px"}
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/icecream_wwomsa"
            alt=""
          />
          <div className="spinner"></div>
        </div>
        <h4>Looking for great food near you....</h4>
      </div>
      <div className="lower-shimmer-container">
        <div className="lower-shimmer">
          {Array(8)
            .fill("")
            .map((_,i) => (
              <div className="shimmer-card" key={i}>
                <div className="shimmer-img"></div>
                <div className="shimmer-title"></div>
                <div className="shimmer-detail"></div>
                <div className="shimmer-detail"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export  function RestShimmer(){
    return (
        <div className="rest-shimmer">
          {Array(2)
            .fill("")
            .map((_,i) => (
              <div className="rest-shimmer-card" key={i}>
                <div className="rest-shimmer-img"></div>
                <div className="shimmer-title"></div>
                <div className="shimmer-detail"></div>
                <div className="shimmer-detail"></div>
              </div>
            ))}
        </div>
    );
}

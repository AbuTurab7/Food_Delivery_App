import './restaurantBoxes.css'
export default function RestaurantBoxes({ BoxesData }) {
 
 
  return (
    <div className="boxes-main-container">
        <p style={{ fontSize: "20px", color: "black", fontWeight: "650" }}>{BoxesData.title}</p>
      <div className="boxes-container">
        {BoxesData?.brands?.map((box, i) => (
          <div key={i} className="boxes">
            <p style={{ fontSize: "14px", color: "#02060CBF" }}>{box.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

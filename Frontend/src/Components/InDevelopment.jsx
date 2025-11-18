import inDevelopmentImg from "../assets/inDevelopment.jpg"
import "./inDevelopment.css";

export default function InDevelopment() {
  return (
    <div className="dev-container">
      <div className="dev-card">
        <img
          src={inDevelopmentImg}
          alt="Under Development"
          className="dev-image"
        />
        <h1>Page Under Development</h1>
        <p style={{color:"#666"}}>We're building this page. Please check back soon!</p>
      </div>
    </div>
  );
}

export default function Card({ title, content, totales, className, gradientIni, gradientEnd, icon }) {
  return (
    <>
      <div
        className={`mb-3 d-flex col justify-content-center ${className}`}
        style={{
          background: `linear-gradient(135deg, ${gradientIni}, ${gradientEnd})`,
          color: "white",
        }}
      >
        <div>
          <div className="d-flex justify-content-between align-content-center">
            <span className="fs-5">{title}</span>
            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "32px", height: "32px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                <i className={`bi bi-${icon} text-secondary`}></i>
            </div>
          </div>
          <span className="fw-bold fs-3">{totales}</span>
          <div>
            <p className="fs-6">{content}</p>
          </div>
        </div>
      </div>
    </>
  );
}

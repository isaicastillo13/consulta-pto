import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function Card({
  title,
  content,
  totales,
  className = "",
  gradientIni = "#3559a1",
  gradientEnd = "#4f7dd1",
  icon = "star",
  classtitulo = "",
}) {
  return (
    <motion.div
      className={`card border-0 shadow-sm text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientIni}, ${gradientEnd})`,
        borderRadius: "1rem",
        minHeight: "140px",
      }}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="card-body d-flex flex-column justify-content-between h-100">
        {/* Título e ícono */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className={`fs-5 fw-bold ${classtitulo}`}>{title}</span>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-white"
            style={{
              width: "36px",
              height: "36px",
            }}
          >
            <i className={`bi bi-${icon} fs-5 text-secondary`}></i>
          </div>
        </div>

        {/* Valor principal */}
        <span className="fw-bold fs-3">{totales}</span>

        {/* Descripción */}
        {content && (
          <p className="fs-6 mt-2 mb-0 opacity-75">{content}</p>
        )}
      </div>
    </motion.div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  totales: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  gradientIni: PropTypes.string,
  gradientEnd: PropTypes.string,
  icon: PropTypes.string,
};

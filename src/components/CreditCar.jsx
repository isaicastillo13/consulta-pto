import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function CreditCard({
  bank = "Scotiabank",
  brand = "REY",
  name = "CLIENTE",
  logo,
  chipIcon = "https://cdn-icons-png.flaticon.com/512/848/848043.png",
  logoVisa = "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
}) {
  return (
    <motion.div
      className="p-3 rounded-4 shadow-lg text-white position-relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #e0e0e0, #b8b8b8)",
        minWidth: "280px",
        maxWidth: "320px",
        minHeight: "190px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Parte superior */}
      <div className="d-flex justify-content-between align-items-start">
        <span className="fw-bold text-danger fs-5">{bank}</span>
        <img
          src={chipIcon}
          alt="Chip"
          style={{ width: "40px", height: "auto" }}
        />
      </div>

      {/* Marca (REY) */}
      <div className="text-center mt-3">
        {logo ? (
          <img src={logo} alt="logo" style={{ maxHeight: "35px" }} />
        ) : (
          <span className="fw-bold fs-3">{brand}</span>
        )}
      </div>

      {/* Nombre y marca Visa */}
      <div className="d-flex justify-content-between align-items-end">
        <span className="fw-semibold text-uppercase">{name}</span>
        <img
          src={logoVisa}
          alt="Visa"
          style={{ width: "60px", height: "auto" }}
        />
      </div>
    </motion.div>
  );
}

CreditCard.propTypes = {
  bank: PropTypes.string,
  brand: PropTypes.string,
  name: PropTypes.string,
  logo: PropTypes.string,
  chipIcon: PropTypes.string,
};

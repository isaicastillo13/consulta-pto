import React from "react";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder = "",
  className = "form-control",
  required = false,

}) {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className={className}
        id={id}
        placeholder={placeholder}
        required={required}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

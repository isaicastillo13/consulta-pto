import React from "react";

export default function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  className = "form-control",
  required = false,
  value,
  onChange,
}) {
  return (
    <div className="form-floating mb-3">
      <input
        id={id}
        name={name}
        type={type}
        className={className}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

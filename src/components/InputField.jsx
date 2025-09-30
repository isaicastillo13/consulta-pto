import React from "react";

export default function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder = "",
  className = "form-control",
  classNameLabel = "",
  required = false,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="form-floating">
      <input
        id={id}
        name={name}
        type={type}
        className={className}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <label className={classNameLabel} htmlFor={id}>{label}</label>
    </div>
  );
}

import React from "react";

export default function SelectField({
  id,
  name,
  value,
  onChange,
  className = "form-select form-select-lg mb-3",
  ariaLabel = "Large select example",
  options = [],
  defaultOption = "Open this select menu",
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      aria-label={ariaLabel}
      required
    >
      <option value="" disabled>
        -- {defaultOption} --
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

import React from "react";

export default function SelectField({
    className = "form-select form-select-lg mb-3",
    ariaLabel = "Large select example",
    options = [],
    defaultOption = "Open this select menu"
}){
    // como se muestra
    return(
        <select
        className={className}
        aria-label={ariaLabel}
        >
            <option selected>{defaultOption}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}


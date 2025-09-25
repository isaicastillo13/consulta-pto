import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import headerImage from "../assets/Header.png";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";

export default function Register() {
  return (
    <div className="container-sm h-100">
      <div>
        <img
          className="img-fluid"
          src={headerImage}
          alt="imagen de punto de oro"
        />
      </div>
      <div>
        <form className="form d-flex align-items-center justify-content-center gap-4" action="">
          <div className="">
            <div>
              <h4>Registro</h4>
              <p>Ya estas registrado? Consultar Puntos.</p>
            </div>
            <div>
              <InputField
                id="name"
                label="Nombre"
                className="form-control rounded-pill"
                placeholder="Ingrese su nombre"
                required={true}
              />
              <InputField
                id="cedula"
                label="Cédula"
                className="form-control rounded-pill"
                placeholder="Ingrese su cédula"
                required={true}
              />
            </div>
          </div>
          <div>
            <div>
              <h4>Escoge 1 pregunta de seguridad</h4>
              <p>Ya estas registrado? Consultar Puntos.</p>
            </div>
           <SelectField
           className="form-select form-select-sm mb-3 rounded-pill py-3"
           ariaLabel="Large select example"
              options={[
                { value: "option1", label: "Opción 1" },
                { value: "option2", label: "Opción 2" },
                { value: "option3", label: "Opción 3" },
                ]}
                defaultOption="Seleccione su pregunta de seguridad"
              />
                <InputField
                  id="respuesta"
                  label="Respuesta"
                  className="form-control rounded-pill"
                  placeholder="Ingrese su respuesta"
                  required={true}
                />


          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
}

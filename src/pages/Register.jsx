import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import headerImage from "../assets/Header.png";
import InputField from "../components/InputField";

export default function Register() {
  return (
    <>
      <header>
        <img src={headerImage} alt="imagen de punto de oro" />
      </header>
      <main>
        <form action="">
          <div>
            <div>
              <h2>Registro</h2>
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
          <div></div>
        </form>
      </main>
      <footer></footer>
    </>
  );
}

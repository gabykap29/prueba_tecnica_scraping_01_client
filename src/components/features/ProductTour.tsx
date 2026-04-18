"use client";

import { useEffect, useState } from "react";
import { Joyride, STATUS, type EventData, type Step } from "react-joyride";

const steps: Step[] = [
  {
    target: "[data-tour='status']",
    title: "Conexion del agente",
    content:
      "Aqui confirmas que el front esta conectado al backend y que el agente puede responder.",
    skipBeacon: true,
  },
  {
    target: "[data-tour='quick-actions']",
    title: "Preguntas predefinidas",
    content:
      "Usa estos botones para cumplir los casos del reporte: comparar, rankings, precios, tiempos, resumen y actualizacion.",
  },
  {
    target: "[data-tour='options']",
    title: "Opciones rapidas",
    content:
      "Algunas preguntas abren opciones. Elige producto, metrica o restaurante y el mensaje se manda al agente.",
  },
  {
    target: "[data-tour='chat-input']",
    title: "Consulta libre",
    content:
      "Tambien puedes escribir una pregunta propia. El agente buscara senales live y explicara lo que encuentre.",
  },
  {
    target: "[data-tour='results']",
    title: "Respuesta, grafico y fuentes",
    content:
      "Las respuestas combinan explicacion, datos para graficos, tablas y links reales usados como fuente.",
  },
];

export function ProductTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = window.localStorage.getItem("rappi-tour-seen");
    if (!hasSeenTour) {
      const timeout = window.setTimeout(() => setRun(true), 500);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  const handleCallback = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      window.localStorage.setItem("rappi-tour-seen", "true");
      setRun(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setRun(true)}
        className="rounded-md border border-[#ffb299] bg-gradient-to-r from-rappi-red to-rappi-orange px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
      >
        Ver guia
      </button>
      <Joyride
        continuous
        onEvent={handleCallback}
        options={{
          arrowColor: "#ffffff",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(33, 18, 15, 0.48)",
          primaryColor: "#ff441f",
          showProgress: true,
          skipBeacon: true,
          textColor: "#21120f",
          zIndex: 1000,
        }}
        run={run}
        scrollToFirstStep
        steps={steps}
        locale={{
          back: "Atras",
          close: "Cerrar",
          last: "Terminar",
          next: "Siguiente",
          skip: "Saltar",
        }}
        styles={{
          buttonPrimary: {
            background: "linear-gradient(90deg, #ff1f1f, #ff6a00)",
            borderRadius: 8,
          },
          buttonBack: {
            color: "#bf1b0d",
          },
          buttonSkip: {
            color: "#7f1710",
          },
          tooltip: {
            borderRadius: 8,
          },
        }}
      />
    </>
  );
}

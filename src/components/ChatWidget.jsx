"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // asegúrate que coincide con tu backend

export default function ChatWidget({ room, user, initialMessages = [], onClose }) {
  const [messages, setMessages] = useState(initialMessages);
  const [mensaje, setMensaje] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Unirse a la sala correspondiente
    socket.emit("join", room);

    // Escuchar mensajes entrantes
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const msg = {
      room,
      remitente: user,
      texto: mensaje,
    };

    socket.emit("message", msg);
    setMensaje(""); // limpiar input
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-300">
      <div className="bg-blue-600 text-white text-center py-2 rounded-t-lg font-semibold">
        Chat #{room}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-2 rounded-lg text-sm shadow-sm ${
              msg.remitente === user
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white border border-gray-300 self-start"
            }`}
          >
            <div className="font-semibold mb-1">{msg.remitente}</div>
            <div>{msg.texto}</div>
            <div className="text-[10px] text-right mt-1 text-gray-200">
              {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="p-3 border-t border-gray-300 bg-white flex gap-2">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

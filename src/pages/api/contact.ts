import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    let name = "";
    let email = "";
    let service = "";
    let message = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await request.json();
      name = data.name;
      email = data.email;
      service = data.service;
      message = data.message;
    } else {
      const formData = await request.formData();
      name = formData.get("name")?.toString() || "";
      email = formData.get("email")?.toString() || "";
      service = formData.get("service")?.toString() || "";
      message = formData.get("message")?.toString() || "";
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Campos requeridos incompletos." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await resend.emails.send({
      from: "LARDOX Web <web@mail.lardox.com>",
      to: ["hello@lardox.com"],
      replyTo: email,
      subject: `[NUEVO BRIEF] ${name} — ${service.toUpperCase() || "GENERAL"}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #050505; color: #ffffff; line-height: 1.6;">
          <h2 style="border-bottom: 1px solid #333; padding-bottom: 10px; color: #ffffff;">// NUEVO CONTACTO RECIBIDO — LARDOX STUDIO</h2>
          <p><strong>CLIENTE / MARCA:</strong> ${name}</p>
          <p><strong>CORREO DE CONTACTO:</strong> ${email}</p>
          <p><strong>TIPO DE PROYECTO:</strong> ${service}</p>
          <br />
          <p><strong>MENSAJE / DETALLES DEL BRIEF:</strong></p>
          <blockquote style="border-left: 2px solid #555; margin-left: 0; padding-left: 15px; color: #ccc;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <hr style="border: none; border-top: 1px solid #222; margin-top: 30px;" />
          <span style="font-size: 11px; color: #666;">Enviado automáticamente desde el formulario web de lardox.com</span>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Brief enviado correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error enviando el formulario:", error);
    return new Response(
      JSON.stringify({ message: "Error interno al procesar la solicitud." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

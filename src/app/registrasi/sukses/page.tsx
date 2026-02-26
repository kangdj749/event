"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const phoneNumber = "6281322817712"; // GANTI NOMOR PANITIA
  const message = encodeURIComponent(
    `Assalamu’alaikum 🙏

Pendaftaran Ramadhan Festival telah berhasil.
Mohon konfirmasi dan info lebih lanjut ya kak.

Terima kasih 🤍`
  );

  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8 border"
      >
        <div className="text-5xl">🎊</div>

        <div>
          <h1 className="text-3xl font-bold">
            Pendaftaran Berhasil
          </h1>
          <p className="text-neutral-500 mt-3">
            Tim kami akan segera menghubungi Anda.
            Silakan klik tombol di bawah untuk konfirmasi via WhatsApp.
          </p>
        </div>

        {/* WhatsApp Button */}
        <a
          href={waLink}
          target="_blank"
          className="block w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Konfirmasi via WhatsApp
        </a>

        {/* QRIS Section */}
        <div className="border-t pt-8 space-y-4">
          <h2 className="text-xl font-semibold">
            Ingin Berinfak untuk Mendukung Acara?
          </h2>

          <div className="flex justify-center">
            <img
              src="/qris.png"
              alt="QRIS Infak"
              className="w-72 md:w-96 rounded-2xl shadow-lg border"
            />
          </div>

          <p className="text-xs text-neutral-400">
            Semoga Allah membalas kebaikan Anda 🤍
          </p>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-neutral-500 hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
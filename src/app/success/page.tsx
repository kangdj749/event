export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function PremiumSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "Peserta";

  // Generate nomor registrasi simple
  const registrationNumber = useMemo(() => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `RF-${new Date().getFullYear()}-${random}`;
  }, []);

  const ADMIN_NUMBER = "6281322817712"; // GANTI

  const message = `Assalamu'alaikum Admin 🙏

Saya ${name}
Nomor Registrasi: ${registrationNumber}

Sudah melakukan pendaftaran.
Mohon info selanjutnya 🤍`;

  const waLink = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  const [seconds, setSeconds] = useState(8);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;

    if (seconds <= 0) {
      window.location.href = waLink;
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, autoRedirect, waLink]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white px-6">

      {/* Confetti */}
      <Confetti recycle={false} numberOfPieces={250} />

      {/* Floating blur circles */}
      <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-10 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl bottom-10 -right-20 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 max-w-xl w-full text-center"
      >
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          🎉 Pendaftaran Berhasil
        </h1>

        <p className="text-neutral-300 mb-6">
          Terima kasih <span className="font-semibold text-white">{name}</span>
        </p>

        {/* Registration Number */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-sm text-neutral-400">Nomor Registrasi</p>
          <p className="text-xl font-semibold tracking-wider mt-1">
            {registrationNumber}
          </p>
        </div>

        {/* QRIS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white text-black rounded-2xl p-6 mb-6"
        >
          <p className="font-semibold mb-4">QRIS Infak (Opsional)</p>
          <img
            src="/qris-ramadhan.jpg"
            alt="QRIS"
            className="w-full max-w-xs mx-auto rounded-xl shadow"
          />
          <p className="text-xs text-gray-600 mt-3">
            Scan untuk mendukung kegiatan 🤍
          </p>
        </motion.div>

        {/* WA BUTTON */}
        <motion.a
          whileTap={{ scale: 0.97 }}
          href={waLink}
          className="block w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
        >
          Konfirmasi via WhatsApp
        </motion.a>

        {/* Countdown */}
        <div className="mt-6 text-sm text-neutral-400">
          {autoRedirect ? (
            <>
              Mengarahkan otomatis dalam{" "}
              <span className="text-white font-semibold">{seconds}</span>{" "}
              detik...
              <br />
              <button
                onClick={() => setAutoRedirect(false)}
                className="underline mt-2"
              >
                Batalkan Redirect
              </button>
            </>
          ) : (
            <button
              onClick={() => setAutoRedirect(true)}
              className="underline"
            >
              Aktifkan Auto Redirect
            </button>
          )}
        </div>

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="mt-8 text-xs text-neutral-500 underline"
        >
          Kembali ke Beranda
        </button>
      </motion.div>
    </div>
  );
}
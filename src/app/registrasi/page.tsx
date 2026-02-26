"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  school: string;
  grade: string;
  city: string;
  competitions: string[];
  tourGallery: boolean;
}

const competitionsList = [
  "Lomba Tahfidz",
  "Lomba Adzan",
  "Lomba Kaligrafi",
  "Lomba Cerdas Cermat",
];

export default function RegistrationPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const selectedCompetitions = watch("competitions") || [];

  const [studentCardUrl, setStudentCardUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Auto scroll to first error
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const el = document.querySelector(
        `[name="${firstError}"]`
      ) as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

  const uploadFile = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-student-card", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setUploading(false);

    if (json.success) {
      setStudentCardUrl(json.url);
      toast.success("Upload berhasil 🎉");
    } else {
      toast.error("Upload gagal");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!studentCardUrl) {
      toast.error("Upload kartu pelajar dulu ya 🙏");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          studentCardUrl,
        }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Pendaftaran berhasil 🎉");

        // redirect dengan nama lengkap
        router.push(
          `/success?name=${encodeURIComponent(data.fullName)}`
        );

        reset();
        setStudentCardUrl("");
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 to-white py-16 px-4">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-200 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Form Pendaftaran
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Estimasi waktu pengisian: ±2 menit
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Nama */}
          <div>
            <input
              {...register("fullName", { required: "Nama wajib diisi" })}
              placeholder="Nama Lengkap"
              className="input"
            />
            {errors.fullName && (
              <p className="error">{errors.fullName.message}</p>
            )}
          </div>

          {/* Tempat & Tanggal */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("birthPlace", { required: "Wajib diisi" })}
                placeholder="Tempat Lahir"
                className="input"
              />
              {errors.birthPlace && (
                <p className="error">{errors.birthPlace.message}</p>
              )}
            </div>

            <div>
              <input
                type="date"
                {...register("birthDate", { required: "Wajib diisi" })}
                className="input"
              />
              {errors.birthDate && (
                <p className="error">{errors.birthDate.message}</p>
              )}
            </div>
          </div>

          {/* Sekolah */}
          <div>
            <input
              {...register("school", { required: "Wajib diisi" })}
              placeholder="Asal Sekolah"
              className="input"
            />
            {errors.school && (
              <p className="error">{errors.school.message}</p>
            )}
          </div>

          {/* Kelas & Kota */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              {...register("grade", { required: "Wajib diisi" })}
              placeholder="Kelas"
              className="input"
            />
            <input
              {...register("city", { required: "Wajib diisi" })}
              placeholder="Kota / Kabupaten"
              className="input"
            />
          </div>

          {/* Lomba */}
          <div>
            <p className="font-semibold mb-3">Pilih Lomba</p>
            <div className="grid grid-cols-2 gap-3">
              {competitionsList.map((item) => {
                const isSelected = selectedCompetitions.includes(item);

                return (
                  <label
                    key={item}
                    className={`rounded-xl p-4 border cursor-pointer transition 
                      ${
                        isSelected
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 hover:border-black"
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={item}
                      {...register("competitions", {
                        validate: (value) =>
                          value?.length > 0 ||
                          "Pilih minimal 1 lomba",
                      })}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.competitions && (
              <p className="error mt-2">
                {errors.competitions.message}
              </p>
            )}
          </div>

          {/* Upload */}
          <div>
            <p className="font-semibold mb-2">
              Upload Kartu Pelajar
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadFile(e.target.files[0]);
                }
              }}
            />

            {uploading && (
              <p className="text-sm text-neutral-500 mt-2">
                Uploading...
              </p>
            )}

            {studentCardUrl && (
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ✔ Upload berhasil
              </span>
            )}
          </div>

          {/* Tour */}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" {...register("tourGallery")} />
            Ikut Tour Galeri Rasulullah
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Daftar Sekarang"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
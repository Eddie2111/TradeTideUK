"use client";
import { useEffect } from "react";

export default function RedirectBack() {
  useEffect(() => {
    // window.history.back();
    window.location.href = "/";
  }, []);

  return null;
}
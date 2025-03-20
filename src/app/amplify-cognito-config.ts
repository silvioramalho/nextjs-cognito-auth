"use client";

import { Amplify } from "aws-amplify";
import { authConfig } from "@/config/auth-config-export";

export function configureAmplifyClientSide() {
  Amplify.configure(
    {
      Auth: authConfig,
    },
    { ssr: true }
  );
}

// Componente que pode ser usado em layouts ou páginas do cliente
export default function ConfigureAmplifyClientSide() {
  configureAmplifyClientSide();
  return null;
}

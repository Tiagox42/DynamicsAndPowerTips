"use client"

import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  language: "pt" | "en"
  onToggle: () => void
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="flex items-center gap-2 min-w-[100px] hover:bg-gray-50"
      title={language === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      {language === "pt" ? (
        <>
          <span className="text-base">🇧🇷</span>
          <span className="font-medium">PT</span>
        </>
      ) : (
        <>
          <span className="text-base">🇺🇸</span>
          <span className="font-medium">EN</span>
        </>
      )}
    </Button>
  )
}

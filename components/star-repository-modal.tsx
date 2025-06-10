"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink, X } from "lucide-react"

interface StarRepositoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StarRepositoryModal({ isOpen, onClose }: StarRepositoryModalProps) {
  const [hasStarred, setHasStarred] = useState(false)

  const handleStarClick = () => {
    setHasStarred(true)
    // Abrir GitHub em nova aba
    window.open("https://github.com/Tiagox42/DynamicsCrmTips", "_blank")

    // Fechar modal após 2 segundos
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Obrigado pela contribuição!
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Seu recurso foi enviado com sucesso! Que tal dar uma estrela no repositório para ajudar o projeto a crescer?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Dynamics CRM Tips</h4>
                <p className="text-sm text-gray-600">Repositório da comunidade</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              ⭐ Dar uma estrela ajuda outros desenvolvedores a descobrir este projeto e incentiva mais contribuições da
              comunidade!
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleStarClick}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={hasStarred}
            >
              <Star className="h-4 w-4 mr-2" />
              {hasStarred ? "Obrigado! ⭐" : "Dar Estrela"}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Talvez depois
            </Button>
          </div>

          {hasStarred && (
            <div className="text-center text-sm text-green-600 font-medium">🎉 Redirecionando para o GitHub...</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

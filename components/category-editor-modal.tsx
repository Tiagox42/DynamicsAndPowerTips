"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, Trash2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface CategoryData {
  key: string
  label: string
  labelEn: string
  icon: string
  subcategories: string[]
}

interface CategoryEditorModalProps {
  isOpen: boolean
  onClose: () => void
  category?: CategoryData | null
  onSave: (category: CategoryData) => void
  onDelete?: (categoryKey: string) => void
}

// Lista de ícones disponíveis
const availableIcons = [
  "BookOpen",
  "Users",
  "Code",
  "BarChart3",
  "Zap",
  "Settings",
  "Lightbulb",
  "Shield",
  "Database",
  "Globe",
  "Cpu",
  "FileText",
  "Tool",
  "Target",
  "Layers",
  "Package",
]

export function CategoryEditorModal({ isOpen, onClose, category, onSave, onDelete }: CategoryEditorModalProps) {
  const [formData, setFormData] = useState<CategoryData>({
    key: "",
    label: "",
    labelEn: "",
    icon: "BookOpen",
    subcategories: [],
  })
  const [newSubcategory, setNewSubcategory] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData(category)
      setIsEditing(true)
    } else {
      setFormData({
        key: "",
        label: "",
        labelEn: "",
        icon: "BookOpen",
        subcategories: [],
      })
      setIsEditing(false)
    }
  }, [category])

  const handleSave = () => {
    if (!formData.label || !formData.key) {
      alert("Por favor, preencha pelo menos o nome e a chave da categoria")
      return
    }

    onSave(formData)
    onClose()
  }

  const handleDelete = () => {
    if (onDelete && category) {
      if (confirm(`Tem certeza que deseja excluir a categoria "${category.label}"?`)) {
        onDelete(category.key)
        onClose()
      }
    }
  }

  const addSubcategory = () => {
    if (newSubcategory.trim()) {
      setFormData((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory.trim()],
      }))
      setNewSubcategory("")
    }
  }

  const removeSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }))
  }

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "")
  }

  const handleLabelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      label: value,
      key: isEditing ? prev.key : generateKey(value),
    }))
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon
    return IconComponent || Icons.BookOpen
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifique os dados da categoria" : "Crie uma nova categoria para organizar os recursos"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Nome da Categoria (PT) *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="Ex: Desenvolvimento e Customização"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labelEn">Nome da Categoria (EN)</Label>
                <Input
                  id="labelEn"
                  value={formData.labelEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, labelEn: e.target.value }))}
                  placeholder="Ex: Development and Customization"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Chave da Categoria *</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData((prev) => ({ ...prev, key: e.target.value }))}
                  placeholder="Ex: desenvolvimento"
                  disabled={isEditing}
                />
                <p className="text-xs text-gray-500">
                  {isEditing ? "A chave não pode ser alterada" : "Gerada automaticamente baseada no nome"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((iconName) => {
                      const IconComponent = getIconComponent(iconName)
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview do Ícone */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-600 p-2 rounded-lg">
                {(() => {
                  const IconComponent = getIconComponent(formData.icon)
                  return <IconComponent className="h-6 w-6 text-white" />
                })()}
              </div>
              <div>
                <h4 className="font-medium">{formData.label || "Nome da Categoria"}</h4>
                <p className="text-sm text-gray-600">{formData.labelEn || "Category Name"}</p>
              </div>
            </div>
          </div>

          {/* Subcategorias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Subcategorias</Label>
              <Badge variant="outline">{formData.subcategories.length} subcategorias</Badge>
            </div>

            {/* Lista de Subcategorias */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {formData.subcategories.map((subcategory, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                  <span className="text-sm">{subcategory}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubcategory(index)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Adicionar Nova Subcategoria */}
            <div className="flex gap-2">
              <Input
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Nome da nova subcategoria"
                onKeyPress={(e) => e.key === "Enter" && addSubcategory()}
              />
              <Button onClick={addSubcategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {isEditing && onDelete && (
                <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Categoria
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

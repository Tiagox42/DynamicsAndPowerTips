import { StarButton } from "./star-button"
import { Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Feito com <Heart className="h-4 w-4 text-red-500 inline mx-1" /> pela comunidade Dynamics CRM
            </p>
          </div>

          <div className="flex items-center gap-4">
            <StarButton owner="Tiagox42" repo="DynamicsCrmTips" showCount={true} />

            <a
              href="https://github.com/Tiagox42/DynamicsCrmTips"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">© 2024 Dynamics CRM Resources. Contribuições são bem-vindas!</p>
        </div>
      </div>
    </footer>
  )
}

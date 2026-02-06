import { SearchX } from 'lucide-react';

export default function Error404Page() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Error code */}
        <div className="space-y-2">
          <h1 className="text-6xl font-semibold text-foreground/40">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Страница не найдена
          </h2>
        </div>

        {/* Explanation */}
        <p className="text-muted-foreground">
          К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или перемещена.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => window.location.hash = '/dashboard'}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            В личный кабинет
          </button>
          <button
            onClick={() => window.location.hash = '/courses'}
            className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            К курсам
          </button>
        </div>
      </div>
    </div>
  );
}

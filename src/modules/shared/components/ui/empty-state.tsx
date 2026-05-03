interface Props {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = '📭', title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
      <span className="text-4xl mb-2">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

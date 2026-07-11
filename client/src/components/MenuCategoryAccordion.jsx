import MenuItemRow from "./MenuItemRow";

export default function MenuCategoryAccordion({ category, isOpen, onToggle, onAddItem }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-display text-base font-semibold text-ink">
          {category.category} <span className="font-mono text-sm font-normal text-muted">({category.items.length})</span>
        </span>
        <span className={`text-tandoori transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {isOpen && (
        <div className="divide-y divide-line border-t border-line px-5">
          {category.items.map((item) => (
            <MenuItemRow key={item.id} item={item} onAdd={() => onAddItem(item)} />
          ))}
        </div>
      )}
    </div>
  );
}

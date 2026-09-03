export default function Qty({ value, onChange, small = false }) {
  return (
    <div className={'qty' + (small ? ' qty--sm' : '')}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease">−</button>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
      />
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase">+</button>
    </div>
  );
}

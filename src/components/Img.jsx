/**
 * `<img>` that degrades to a plain placeholder block (matching --cat-bg)
 * instead of a broken-image icon when `src` is empty - many demo/unconfigured
 * categories, sliders, and products in a real business have no uploaded
 * photo yet, and a broken <img> reads as a bug rather than "no photo set".
 * Defaults to absolutely filling a `position: relative` parent with
 * object-fit: cover (the pattern every media slot in this design uses) -
 * pass `style` to override for a normal in-flow image.
 *
 * The placeholder renders a <div>, never a <span> - several containers in
 * this stylesheet (e.g. .collection-card span) style ANY span child for an
 * unrelated purpose (an absolutely-positioned caption), which would hijack
 * a span-based placeholder's layout entirely.
 */
export default function Img({ src, alt = '', className = '', style, fill = true, loading = 'lazy', ...rest }) {
  const baseStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  if (!src) {
    return (
      <div
        className={className}
        style={{ ...baseStyle, display: 'block', background: 'var(--cat-bg)', ...style }}
        role="img"
        aria-label={alt}
        {...rest}
      />
    );
  }
  return <img className={className} src={src} alt={alt} loading={loading} style={{ ...baseStyle, ...style }} {...rest} />;
}

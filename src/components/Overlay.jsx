import { useCart } from '../context/CartContext';

export default function Overlay() {
  const { closeAll } = useCart();
  return <div className="overlay" onClick={closeAll} />;
}

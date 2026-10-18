import { useState } from 'react';
const products = [
  { id: 'senior', name: 'Senior Debug Duck', desc: 'Findet Bugs durch Schweigen.', price: 2999, emoji: '🦆' },
  { id: 'cloud', name: 'Cloud Native Duck', desc: 'Skaliert bis zum Badewannenrand.', price: 4999, emoji: '☁️' },
  { id: 'rubber', name: 'Rubber Duck Classic', desc: 'Der Klassiker für jedes Code Review.', price: 999, emoji: '🐤' },
];
const eur = (cents: number) => (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
export default function App() {
  const [cart, setCart] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [query, setQuery] = useState('');
  const subtotal = cart.reduce((sum, id) => sum + (products.find((p) => p.id === id)?.price ?? 0), 0);
  const bug = new URLSearchParams(location.search).get('bug') === 'discount';
  const total = applied ? Math.round(subtotal * (bug ? 0.6 : 0.5)) : subtotal;
  return <div className="page">
    <header><div className="brand">DUCKAZON<span>.dev</span></div><div className="cart-label">🛒 Warenkorb <b data-testid="cart-count">{cart.length}</b></div></header>
    <section className="hero"><div><div className="eyebrow">100 % QUACK-DRIVEN DEVELOPMENT</div><h1>Debugging ohne Ente?<br/><em>Unvorstellbar.</em></h1><p>Das wichtigste Entwicklerwerkzeug hat einen Schnabel.</p></div><div className="hero-duck">🦆</div></section>
    <main><div className="heading"><h2>Unsere Debugging-Profis</h2><input aria-label="Produkte suchen" placeholder="Ente suchen …" value={query} onChange={(e) => setQuery(e.target.value)}/></div>
    <div className="products">{products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(p => <article key={p.id} className="product"><div className="product-art">{p.emoji}</div><h3>{p.name}</h3><p>{p.desc}</p><div className="product-footer"><strong>{eur(p.price)}</strong><button onClick={() => {setCart([...cart, p.id]);setOrdered(false);}} aria-label={`${p.name} hinzufügen`}>+ In den Korb</button></div></article>)}</div>
    <section className="checkout"><div><h2>🛒 Checkout</h2><p>{cart.length ? `${cart.length} Enten warten auf ihren großen Auftritt.` : 'Dein Warenkorb ist noch schnabellos.'}</p><label htmlFor="coupon">Rabattcode</label><div className="coupon"><input id="coupon" value={code} onChange={e => {setCode(e.target.value);setApplied(false);}} placeholder="z. B. QUACK50"/><button onClick={() => setApplied(code.trim().toUpperCase() === 'QUACK50')} disabled={!cart.length}>Einlösen</button></div>{applied && <p role="status" className="success">QUACK50 aktiviert: 50 % Rabatt!</p>}{code && !applied && <p className="hint">Tipp: QUACK50</p>}</div><div className="summary"><div>Zwischensumme <span>{eur(subtotal)}</span></div><div>Rabatt <span>{applied ? '50 %' : '–'}</span></div><div className="total">Gesamt <strong data-testid="total">{eur(total)}</strong></div><button className="order" disabled={!cart.length} onClick={() => setOrdered(true)}>Jetzt bestellen →</button>{ordered && <p role="status" className="success">Bestellung bestätigt. Quack!</p>}</div></section>
    </main><footer>Duckazon · Keine echten Enten wurden für diesen Test verletzt. · Built for Playwright</footer>
  </div>;
}

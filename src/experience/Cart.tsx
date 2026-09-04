import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExperienceStore } from './store';
import { DRIFT_COLLECTION } from '../data/products';

export default function Cart() {
  const isCartOpen = useExperienceStore((state) => state.isCartOpen);
  const setIsCartOpen = useExperienceStore((state) => state.setIsCartOpen);
  const cart = useExperienceStore((state) => state.cart);
  const removeFromCart = useExperienceStore((state) => state.removeFromCart);
  const updateCartQuantity = useExperienceStore((state) => state.updateCartQuantity);

  const [isCheckout, setIsCheckout] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Reset states when cart closes
  React.useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => {
        setIsCheckout(false);
        setIsSuccess(false);
      }, 300);
    }
  }, [isCartOpen]);

  const handleCheckoutComplete = () => {
    setIsSuccess(true);
    // Usually we would clear cart here but we keep it simple
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-drift-surface border-l border-drift-border/40 shadow-2xl z-50 pointer-events-auto flex flex-col"
          >
            <header className="p-8 border-b border-drift-border/30 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {isCheckout && !isSuccess && (
                  <button onClick={() => setIsCheckout(false)} className="text-drift-foreground-muted hover:text-drift-foreground">
                    ←
                  </button>
                )}
                <h2 className="text-xl font-display tracking-tight text-drift-accent">
                  {isSuccess ? 'Confirmed' : isCheckout ? 'Checkout' : 'Your Cart'}
                </h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-xs uppercase tracking-widest text-drift-foreground-muted hover:text-drift-foreground transition-colors"
              >
                Close
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-display text-drift-accent mb-4">Order Received</h3>
                    <p className="text-sm font-sans tracking-widest uppercase text-drift-foreground-muted mb-8">
                      Your ritual begins soon.
                    </p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs uppercase tracking-[0.2em] text-drift-accent border-b border-drift-accent/30 pb-1"
                    >
                      Return to Drift
                    </button>
                  </motion.div>
                ) : isCheckout ? (
                  <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-4">Contact</h3>
                      <input type="email" placeholder="Email Address" className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm outline-none focus:border-drift-accent/50" />
                    </div>
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-4">Shipping</h3>
                      <div className="flex flex-col gap-3">
                        <input type="text" placeholder="Full Name" className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm outline-none focus:border-drift-accent/50" />
                        <input type="text" placeholder="Address" className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm outline-none focus:border-drift-accent/50" />
                        <div className="flex gap-3">
                          <input type="text" placeholder="City" className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm outline-none focus:border-drift-accent/50" />
                          <input type="text" placeholder="Postal Code" className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm outline-none focus:border-drift-accent/50" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-4">Payment (Simulated)</h3>
                      <div className="w-full bg-drift-surface-hover/30 border border-drift-border/50 p-3 rounded-sm text-sm text-drift-foreground-muted flex justify-between items-center">
                        <span>Card Number</span>
                        <span>MM/YY CVC</span>
                      </div>
                    </div>
                  </motion.div>
                ) : cart.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <p className="text-sm font-sans tracking-widest uppercase mb-4">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs uppercase tracking-[0.2em] text-drift-accent border-b border-drift-accent/30 pb-1"
                    >
                      Continue Exploration
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="cart-items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                    {cart.map(item => {
                      const product = DRIFT_COLLECTION.find(p => p.id === item.productId);
                      if (!product) return null;
                      
                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex-1">
                            <h3 className="font-display text-lg mb-1">{product.name}</h3>
                            <div className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-4">
                              {item.variant} • {product.roast}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-drift-border/50 rounded-sm">
                                <button 
                                  onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-1 text-drift-foreground-muted hover:text-drift-foreground"
                                >-</button>
                                <span className="text-xs tabular-nums w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-drift-foreground-muted hover:text-drift-foreground"
                                >+</button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-[10px] uppercase tracking-widest text-drift-foreground-muted hover:text-red-400/80 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-display tracking-tight">${item.price * item.quantity}</div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isSuccess && cart.length > 0 && (
              <footer className="p-8 border-t border-drift-border/30 bg-drift-surface-hover/30">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-xs uppercase tracking-widest text-drift-foreground-muted">Total</span>
                  <span className="text-3xl font-display text-drift-accent tabular-nums tracking-tighter">${subtotal}</span>
                </div>
                {isCheckout ? (
                  <button 
                    onClick={handleCheckoutComplete}
                    className="w-full bg-drift-accent text-drift-bg py-4 text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-drift-accent/90 transition-colors"
                  >
                    Confirm Purchase
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="w-full bg-drift-accent text-drift-bg py-4 text-xs font-medium tracking-[0.2em] uppercase rounded-sm hover:bg-drift-accent/90 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </footer>
            )}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

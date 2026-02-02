import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="sidebar-widget newsletter-widget">
      <div className="widget-icon">
        <Star size={20} />
      </div>
      <h4 className="widget-title">Newsletter</h4>

      {isSubmitted ? (
        <div className="newsletter-success">
          <CheckCircle size={24} color="#10b981" />
          <p>Inscricao confirmada!</p>
        </div>
      ) : (
        <>
          <p className="widget-description">
            Receba os melhores conteudos sobre tecnologia e inovacao.
          </p>
          <form className="sidebar-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm w-full" disabled={isLoading}>
              {isLoading ? 'Inscrevendo...' : 'Inscrever-se Gratuitamente'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

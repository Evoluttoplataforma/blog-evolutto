import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, X } from 'lucide-react';

export default function LeadMagnetCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);

    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', company: '' });
    }, 3000);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="sidebar-premium-banner sidebar-cta-ebook"
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="premium-banner-bg"></div>
        <div className="premium-banner-content">
          <div className="premium-badge">E-book Gratuito</div>
          <h4>Escale sua Consultoria</h4>
          <p>Baixe agora e aprenda como digitalizar sua consultoria e aumentar seu faturamento.</p>
          <ul className="premium-features">
            <li><CheckCircle size={14} /> Estrategias de digitalizacao</li>
            <li><CheckCircle size={14} /> Aumento de faturamento</li>
            <li><CheckCircle size={14} /> Cases de sucesso reais</li>
          </ul>
          <button className="btn btn-white btn-sm w-full">
            <Download size={14} /> Baixar gratis
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <motion.div
            className="modal-content lead-magnet-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>

            {isSubmitted ? (
              <div className="form-success">
                <CheckCircle size={48} color="#10b981" />
                <h3>E-book enviado!</h3>
                <p>Verifique seu e-mail para baixar o material.</p>
              </div>
            ) : (
              <div className="lead-magnet-container">
                <div className="lead-magnet-info">
                  <h3>E-book Gratuito</h3>
                  <h2>Escale sua Consultoria com a Evolutto</h2>
                  <p>Aprenda como digitalizar sua consultoria e aumentar seu faturamento.</p>
                  <ul>
                    <li><CheckCircle size={16} /> 50+ paginas de conteudo</li>
                    <li><CheckCircle size={16} /> 10 cases de sucesso reais</li>
                    <li><CheckCircle size={16} /> Templates prontos para usar</li>
                  </ul>
                </div>
                <form className="lead-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Seu e-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      placeholder="Seu telefone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Sua empresa"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Baixar E-book Gratis'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

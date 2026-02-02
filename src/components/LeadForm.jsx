import React, { useState, useEffect } from 'react';
import { Download, BookOpen, CheckCircle, Mail, Sparkles } from 'lucide-react';
import './Modal.css';

// Get UTM parameters from URL
const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
    };
};

// Newsletter Form Component
export const NewsletterForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ...getUTMParams()
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call - replace with your actual endpoint
        console.log('Newsletter form data:', formData);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSuccess(true);
        setIsSubmitting(false);

        if (onSuccess) onSuccess(formData);
    };

    if (isSuccess) {
        return (
            <div className="form-success">
                <div className="form-success-icon">
                    <CheckCircle size={40} />
                </div>
                <h3>Inscrição Confirmada!</h3>
                <p>Você receberá nossos melhores conteúdos diretamente no seu e-mail.</p>
                <button className="btn btn-primary" onClick={() => setIsSuccess(false)}>
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <form className="lead-form" onSubmit={handleSubmit}>
            <div className="lead-form-header">
                <div className="lead-form-icon">
                    <Mail size={36} />
                </div>
                <h3 className="lead-form-title">Receba Insights Exclusivos</h3>
                <p className="lead-form-subtitle">
                    Junte-se a mais de 10.000 consultores que recebem conteúdo estratégico toda semana.
                </p>
            </div>

            <div className="lead-form-benefits">
                <ul>
                    <li><CheckCircle size={16} /> Tendências do mercado de consultoria</li>
                    <li><CheckCircle size={16} /> Dicas práticas de digitalização</li>
                    <li><CheckCircle size={16} /> Cases de sucesso exclusivos</li>
                </ul>
            </div>

            <div className="form-field">
                <label htmlFor="newsletter-name">Seu nome</label>
                <input
                    type="text"
                    id="newsletter-name"
                    name="name"
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="newsletter-email">Seu melhor e-mail</label>
                <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Hidden UTM fields */}
            <input type="hidden" name="utm_source" value={formData.utm_source} />
            <input type="hidden" name="utm_medium" value={formData.utm_medium} />
            <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
            <input type="hidden" name="utm_term" value={formData.utm_term} />
            <input type="hidden" name="utm_content" value={formData.utm_content} />

            <div className="form-submit">
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>Inscrevendo...</>
                    ) : (
                        <>Inscrever-se Gratuitamente <Sparkles size={18} /></>
                    )}
                </button>
            </div>

            <p className="form-privacy">
                Respeitamos sua privacidade. Cancele quando quiser.
            </p>
        </form>
    );
};

// Lead Magnet Form Component (E-book download)
export const LeadMagnetForm = ({ onSuccess, leadMagnetTitle = "E-book Gratuito" }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        ...getUTMParams()
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call - replace with your actual endpoint
        console.log('Lead magnet form data:', formData);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSuccess(true);
        setIsSubmitting(false);

        if (onSuccess) onSuccess(formData);
    };

    if (isSuccess) {
        return (
            <div className="form-success">
                <div className="form-success-icon">
                    <CheckCircle size={40} />
                </div>
                <h3>Download Liberado!</h3>
                <p>Enviamos o link de download para o seu e-mail. Confira sua caixa de entrada.</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="lead-magnet-container">
            <div className="lead-magnet-image hide-mobile">
                <img src="https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800" alt="E-book Preview" />
                <div className="image-overlay-text">
                    <Sparkles size={24} />
                    <span>Conteúdo Premium</span>
                </div>
            </div>
            <form className="lead-form" onSubmit={handleSubmit}>
                <div className="lead-form-header">
                    <div className="lead-form-icon">
                        <Download size={32} />
                    </div>
                    <h3 className="lead-form-title">Baixe seu E-book Agora</h3>
                    <p className="lead-form-subtitle">
                        Transforme sua consultoria com o guia mais completo do mercado.
                    </p>
                </div>

                <div className="lead-form-benefits">
                    <ul>
                        <li><CheckCircle size={16} /> 50+ Páginas de Estratégia</li>
                        <li><CheckCircle size={16} /> Cases Reais de Sucesso</li>
                    </ul>
                </div>

                <div className="form-field">
                    <label htmlFor="lead-name">Nome Completo</label>
                    <input
                        type="text"
                        id="lead-name"
                        name="name"
                        placeholder="Como podemos te chamar?"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="lead-email">E-mail Profissional</label>
                    <input
                        type="email"
                        id="lead-email"
                        name="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="lead-phone">WhatsApp</label>
                        <input
                            type="tel"
                            id="lead-phone"
                            name="phone"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Hidden UTM fields */}
                <input type="hidden" name="utm_source" value={formData.utm_source} />
                <input type="hidden" name="utm_medium" value={formData.utm_medium} />
                <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
                <input type="hidden" name="utm_term" value={formData.utm_term} />
                <input type="hidden" name="utm_content" value={formData.utm_content} />
                <input type="hidden" name="lead_magnet" value={leadMagnetTitle} />

                <div className="form-submit">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Processando...' : 'Receber Material Gratuito'}
                    </button>
                </div>

                <p className="form-privacy">
                    Seus dados estão seguros. <a href="/privacy">Privacidade</a>.
                </p>
            </form>
        </div>
    );
};

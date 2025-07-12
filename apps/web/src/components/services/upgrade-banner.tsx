'use client';

import { Button } from '@/components/ui/button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface UpgradeBannerProps {
  userPlan?: 'FREE' | 'PREMIUM';
  leadsUsed?: number;
  leadsLimit?: number;
  onUpgrade?: () => void;
}

export function UpgradeBanner({ 
  userPlan = 'FREE', 
  leadsUsed = 0, 
  leadsLimit = 10,
  onUpgrade 
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Only show for FREE users
  if (userPlan !== 'FREE' || dismissed) {
    return null;
  }

  const isAtLimit = leadsUsed >= leadsLimit;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 rounded-full p-2">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <p className="font-semibold">
                  {isAtLimit ? 'Limite de leads atingido!' : 'Leads limitados no plano FREE'}
                </p>
                <p className="text-sm text-blue-100">
                  {isAtLimit 
                    ? 'Faça upgrade para continuar recebendo leads'
                    : `${leadsUsed}/${leadsLimit} leads usados esta semana`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-100">Premium:</span>
                <span className="font-semibold">40 leads/mês</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-100">Top List:</span>
                <span className="font-semibold">4x/semana</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-100">ADS:</span>
                <span className="font-semibold">Ilimitado</span>
              </div>
            </div>
            
            <Button 
              onClick={onUpgrade}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2"
            >
              Upgrade por $34.80/mês
            </Button>
            
            <button
              onClick={() => setDismissed(true)}
              className="text-white/80 hover:text-white p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar limitações durante navegação
export function ServiceLimitationModal({ 
  isOpen, 
  onClose, 
  limitationType 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  limitationType: 'leads' | 'contact' | 'favorites' 
}) {
  if (!isOpen) return null;

  const limitations = {
    leads: {
      title: 'Limite de leads atingido',
      description: 'Você já utilizou todos os 10 leads desta semana no plano FREE.',
      benefits: ['40 leads por mês', 'Prioridade no topo da lista', 'Campanhas ADS ilimitadas']
    },
    contact: {
      title: 'Contato limitado',
      description: 'Para entrar em contato com mais profissionais, faça upgrade para Premium.',
      benefits: ['Contatos ilimitados', 'Resposta prioritária', 'Templates automáticos']
    },
    favorites: {
      title: 'Favoritos limitados',
      description: 'Usuários FREE podem salvar até 5 favoritos.',
      benefits: ['Favoritos ilimitados', 'Listas personalizadas', 'Alertas de disponibilidade']
    }
  };

  const current = limitations[limitationType];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {current.title}
          </h3>
          <p className="text-gray-600">
            {current.description}
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Com o Premium você teria:
          </h4>
          <ul className="space-y-2">
            {current.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Continuar FREE
          </Button>
          <Button 
            onClick={() => window.location.href = '/dashboard/upgrade'}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Upgrade agora
          </Button>
        </div>
      </div>
    </div>
  );
} 
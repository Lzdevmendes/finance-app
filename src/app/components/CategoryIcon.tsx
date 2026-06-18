import React from 'react';
import {
  ShoppingCart,
  Home,
  Car,
  Heart,
  Shirt,
  Smartphone,
  Utensils,
  Gift,
  GraduationCap,
  Plane,
  Film,
  DollarSign,
  TrendingUp,
  Briefcase,
  PiggyBank,
  Building,
  Wrench,
  Shield,
  FileText,
  HandHeart,
} from 'lucide-react';

const categories = [
  { value: 'alimentacao', label: 'Alimentação', icon: '🍽️' },
  { value: 'lazer', label: 'Lazer', icon: '🎉' },
  { value: 'transporte', label: 'Transporte', icon: '🚗' },
  { value: 'casa', label: 'Casa', icon: '🏠' },
  { value: 'saude', label: 'Saúde', icon: '🏥' },
  { value: 'pessoal', label: 'Pessoal', icon: '👤' },
  { value: 'educacao', label: 'Educação', icon: '📚' },
  { value: 'compras', label: 'Compras', icon: '🛒' },
  { value: 'viagem', label: 'Viagem', icon: '✈️' },
  { value: 'tecnologia', label: 'Tecnologia', icon: '💻' },
  { value: 'investimentos', label: 'Investimentos', icon: '📈' },
  { value: 'salario', label: 'Salário', icon: '💰' },
  { value: 'freelance', label: 'Freelance', icon: '💼' },
  { value: 'bonus', label: 'Bônus', icon: '🎁' },
  { value: 'dividendos', label: 'Dividendos', icon: '📊' },
  { value: 'aluguel', label: 'Aluguel', icon: '🏢' },
  { value: 'servicos', label: 'Serviços', icon: '🔧' },
  { value: 'seguros', label: 'Seguros', icon: '🛡️' },
  { value: 'impostos', label: 'Impostos', icon: '📋' },
  { value: 'doacoes', label: 'Doações', icon: '❤️' },
  { value: 'outros', label: 'Outros', icon: '📝' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  alimentacao: <Utensils size={18} />,
  lazer: <Film size={18} />,
  transporte: <Car size={18} />,
  casa: <Home size={18} />,
  saude: <Heart size={18} />,
  pessoal: <Shirt size={18} />,
  educacao: <GraduationCap size={18} />,
  compras: <ShoppingCart size={18} />,
  viagem: <Plane size={18} />,
  tecnologia: <Smartphone size={18} />,
  investimentos: <TrendingUp size={18} />,
  salario: <DollarSign size={18} />,
  freelance: <Briefcase size={18} />,
  bonus: <Gift size={18} />,
  dividendos: <PiggyBank size={18} />,
  aluguel: <Building size={18} />,
  servicos: <Wrench size={18} />,
  seguros: <Shield size={18} />,
  impostos: <FileText size={18} />,
  doacoes: <HandHeart size={18} />,
  outros: <DollarSign size={18} />,
};

export function getCategoryIcon(category: string) {
  return categoryIcons[category] || categoryIcons.outros;
}

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  // First try to find emoji for the category
  const categoryData = categories.find(cat => cat.value === category);
  if (categoryData?.icon) {
    return <span className={className}>{categoryData.icon}</span>;
  }

  // Fallback to Lucide icons
  return <div className={className}>{getCategoryIcon(category)}</div>;
}

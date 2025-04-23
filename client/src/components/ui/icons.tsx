import { 
  Facebook, 
  Instagram, 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign,
  Shield,
  Truck,
  RefreshCcw,
  CheckCircle,
  CreditCard,
  LucideIcon
} from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

export type IconType = LucideIcon | typeof FaWhatsapp | typeof FaTiktok;

interface SocialIconProps {
  platform: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok';
  size?: number;
  className?: string;
}

export function SocialIcon({ platform, size = 24, className }: SocialIconProps) {
  switch (platform) {
    case 'facebook':
      return <Facebook size={size} className={className} />;
    case 'instagram':
      return <Instagram size={size} className={className} />;
    case 'whatsapp':
      return <FaWhatsapp size={size} className={className} />;
    case 'tiktok':
      return <FaTiktok size={size} className={className} />;
  }
}

export const StatIcons = {
  sales: ShoppingBag,
  customers: Users,
  products: Package,
  profit: DollarSign
};

export const TrustIcons = {
  escrow: Shield,
  logistics: Truck,
  returns: RefreshCcw
};

export const PaymentIcons = {
  visa: CreditCard,
  mastercard: CreditCard,
  amex: CreditCard,
  paypal: DollarSign,
  applePay: CreditCard,
  googlePay: CreditCard
};

export const StatusIcons = {
  completed: CheckCircle,
  success: CheckCircle
};

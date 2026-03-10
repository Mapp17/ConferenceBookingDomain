'use client';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ 
  label, 
  onClick, 
  type = 'button',
  variant = 'primary' 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary-400 text-white hover:bg-primary-500 focus:ring-primary-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}
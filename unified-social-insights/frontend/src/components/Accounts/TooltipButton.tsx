import React from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  className: string;
  title: string;
  children: React.ReactNode;
}

const TooltipButton = ({ onClick, disabled, className, title, children }: Props) => (
  <div className="relative group">
    <button onClick={onClick} disabled={disabled} className={className} title={title}>
      {children}
    </button>
    <div className="absolute left-1/2 -bottom-8 z-50 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none bg-gray-800 text-white text-xs rounded px-2 py-1 transition">
      {title}
    </div>
  </div>
);

export default React.memo(TooltipButton);

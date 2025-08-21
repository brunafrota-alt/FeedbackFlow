import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const labels = {
    1: 'Muito Insatisfeito',
    2: 'Insatisfeito',
    3: 'Neutro',
    4: 'Satisfeito',
    5: 'Muito Satisfeito'
  };

  return (
    <div>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={`w-8 h-8 transition-all duration-200 ${
              disabled ? 'cursor-not-allowed' : 'hover:scale-110 hover-lift'
            } ${
              star <= (hoverValue || value)
                ? 'text-primary animate-glow'
                : 'text-muted-foreground/50'
            }`}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => !disabled && setHoverValue(0)}
            onClick={() => !disabled && onChange(star)}
            data-testid={`star-${star}`}
          >
            <Star fill="currentColor" />
          </button>
        ))}
        <span className="ml-3 text-sm font-medium text-card-foreground">
          {value > 0 ? labels[value as keyof typeof labels] : 'Selecione uma avaliação'}
        </span>
      </div>
    </div>
  );
}

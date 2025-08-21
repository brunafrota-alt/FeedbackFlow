import { useState, useMemo } from 'react';
import { type Feedback } from '@shared/schema';
import { Star } from 'lucide-react';

interface FeedbackListProps {
  feedbacks: Feedback[];
}

type FilterType = 'all' | '1' | '2' | '3' | '4' | '5' | '4-5';
type SortType = 'newest' | 'oldest' | 'highest' | 'lowest';

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [displayCount, setDisplayCount] = useState(8);

  const filteredAndSortedFeedbacks = useMemo(() => {
    let filtered = feedbacks;

    // Apply filter
    if (filter === '4-5') {
      filtered = feedbacks.filter(f => f.rating >= 4);
    } else if (filter !== 'all') {
      filtered = feedbacks.filter(f => f.rating === parseInt(filter));
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [feedbacks, filter, sort]);

  const displayedFeedbacks = filteredAndSortedFeedbacks.slice(0, displayCount);

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateGradient = (name: string) => {
    const gradients = [
      'from-green-400 to-green-600',
      'from-emerald-400 to-emerald-600',
      'from-teal-400 to-teal-600',
      'from-lime-400 to-lime-600',
      'from-green-500 to-emerald-700',
      'from-teal-400 to-green-600',
      'from-emerald-300 to-green-500',
      'from-lime-400 to-emerald-600'
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `há ${minutes} minutos`;
    } else if (hours < 24) {
      return `há ${hours} horas`;
    } else {
      return `há ${days} dias`;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-slate-300'}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-card rounded-xl shadow-lg border border-border p-6 animate-slide-in hover-lift">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Filtros de Visualização</h3>
          <button
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover-lift"
            onClick={() => setFilter('all')}
            data-testid="button-clear-filters"
          >
            Limpar Filtros
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: '5', label: '⭐⭐⭐⭐⭐ (5)' },
            { key: '4', label: '⭐⭐⭐⭐ (4)' },
            { key: '3', label: '⭐⭐⭐ (3)' },
            { key: '2', label: '⭐⭐ (2)' },
            { key: '1', label: '⭐ (1)' },
            { key: '4-5', label: 'Satisfeitos (4-5)' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-border transition-all duration-200 hover-lift ${
                filter === key
                  ? 'bg-primary text-primary-foreground animate-glow'
                  : 'bg-card text-card-foreground hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => setFilter(key as FilterType)}
              data-testid={`filter-${key}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-card rounded-xl shadow-lg border border-border p-6 animate-slide-in hover-lift">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Feedbacks Recentes</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-feedback-count">
              Mostrando {displayedFeedbacks.length} de {filteredAndSortedFeedbacks.length} feedbacks
            </p>
          </div>
          <select
            className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-foreground hover-lift transition-all duration-200 focus:ring-2 focus:ring-primary"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            data-testid="select-sort"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="highest">Maior Avaliação</option>
            <option value="lowest">Menor Avaliação</option>
          </select>
        </div>

        {displayedFeedbacks.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-state">
            <p className="text-muted-foreground">Nenhum feedback encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 border border-border rounded-lg hover:bg-primary/5 transition-all duration-200 hover-lift animate-bounce-in"
                data-testid={`feedback-item-${feedback.id}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${generateGradient(feedback.name)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {generateInitials(feedback.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-card-foreground" data-testid={`text-feedback-name-${feedback.id}`}>
                        {feedback.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {renderStars(feedback.rating)}
                        <span className="text-xs text-muted-foreground" data-testid={`text-feedback-time-${feedback.id}`}>
                          {formatTimestamp(feedback.timestamp)}
                        </span>
                      </div>
                    </div>
                    {feedback.comment && (
                      <p className="text-sm text-muted-foreground" data-testid={`text-feedback-comment-${feedback.id}`}>
                        {feedback.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedFeedbacks.length > displayCount && (
          <div className="mt-6 text-center">
            <button
              className="px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover-lift animate-glow"
              onClick={() => setDisplayCount(prev => prev + 8)}
              data-testid="button-load-more"
            >
              Carregar Mais Feedbacks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

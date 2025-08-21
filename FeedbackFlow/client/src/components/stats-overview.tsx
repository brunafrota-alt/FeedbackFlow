import { type Feedback } from '@shared/schema';
import { Star, Smile, Meh, Frown } from 'lucide-react';

interface StatsOverviewProps {
  feedbacks: Feedback[];
}

export function StatsOverview({ feedbacks }: StatsOverviewProps) {
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0 
    ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks).toFixed(1)
    : '0.0';
  
  const satisfiedCount = feedbacks.filter(f => f.rating >= 4).length;
  const neutralCount = feedbacks.filter(f => f.rating === 3).length;
  const unsatisfiedCount = feedbacks.filter(f => f.rating <= 2).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover-lift animate-bounce-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
            <p className="text-2xl font-bold text-primary" data-testid="text-average-rating">{averageRating}</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center animate-float">
            <Star className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover-lift animate-bounce-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Satisfeitos</p>
            <p className="text-2xl font-bold text-secondary" data-testid="text-satisfied-count">{satisfiedCount}</p>
          </div>
          <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center animate-glow">
            <Smile className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover-lift animate-bounce-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Neutros</p>
            <p className="text-2xl font-bold text-warning" data-testid="text-neutral-count">{neutralCount}</p>
          </div>
          <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center animate-pulse-green">
            <Meh className="w-6 h-6 text-warning" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover-lift animate-bounce-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Insatisfeitos</p>
            <p className="text-2xl font-bold text-accent" data-testid="text-unsatisfied-count">{unsatisfiedCount}</p>
          </div>
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center animate-float">
            <Frown className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

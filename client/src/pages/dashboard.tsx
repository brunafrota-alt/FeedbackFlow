import { type Feedback } from '@shared/schema';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FeedbackForm } from '@/components/feedback-form';
import { FeedbackList } from '@/components/feedback-list';
import { StatsOverview } from '@/components/stats-overview';
import { RatingChart } from '@/components/rating-chart';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>('techflow-feedbacks', []);

  const handleNewFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const totalFeedbacks = feedbacks.length;

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="bg-card shadow-lg border-b border-border animate-slide-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center animate-float animate-glow">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TechFlow</h1>
                <p className="text-sm text-muted-foreground">Sistema de Feedbacks</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right animate-bounce-in">
                <p className="text-sm font-medium text-foreground" data-testid="text-total-feedbacks">
                  {totalFeedbacks} Feedbacks
                </p>
                <p className="text-xs text-muted-foreground">Total coletados</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse-green"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-slide-in">
          <StatsOverview feedbacks={feedbacks} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-1 animate-bounce-in">
            <FeedbackForm onSubmit={handleNewFeedback} />
          </div>

          {/* Dashboard Area */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in">
            <RatingChart feedbacks={feedbacks} />
            <FeedbackList feedbacks={feedbacks} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-glow">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">TechFlow Feedback System</p>
                <p className="text-xs text-muted-foreground">© 2024 - Sistema de Coleta de Feedbacks</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Versão 1.0.0</p>
              <p className="text-xs text-muted-foreground">Desenvolvido com 💚</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

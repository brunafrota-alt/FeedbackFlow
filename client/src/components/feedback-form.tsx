import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { insertFeedbackSchema, type InsertFeedback, type Feedback } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRating } from './star-rating';
import { CheckCircle, Send, Plus } from 'lucide-react';

interface FeedbackFormProps {
  onSubmit: (feedback: Feedback) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: '',
      rating: 0,
      comment: '',
    },
  });

  const handleSubmit = (data: InsertFeedback) => {
    const feedback: Feedback = {
      ...data,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };
    
    onSubmit(feedback);
    form.reset();
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6 hover-lift">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center animate-pulse-green">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Novo Feedback</h2>
          <p className="text-sm text-muted-foreground">Compartilhe sua experiência</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" data-testid="feedback-form">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-card-foreground">
                  Nome Completo
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite seu nome"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover-lift bg-background"
                    data-testid="input-name"
                  />
                </FormControl>
                <p className="mt-1 text-xs text-muted-foreground">Mínimo 2 caracteres</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-card-foreground mb-3">
                  Avaliação Geral
                </FormLabel>
                <FormControl>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-card-foreground">
                  Comentário (Opcional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Compartilhe detalhes sobre sua experiência..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none hover-lift bg-background"
                    data-testid="input-comment"
                  />
                </FormControl>
                <p className="mt-1 text-xs text-muted-foreground">Máximo 500 caracteres</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 animate-glow hover-lift"
            data-testid="button-submit"
          >
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Enviar Feedback</span>
            </div>
          </Button>
        </form>
      </Form>

      {showSuccess && (
        <div className="mt-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg animate-bounce-in" data-testid="success-message">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-secondary animate-glow" />
            <span className="text-sm font-medium text-secondary">Feedback enviado com sucesso!</span>
          </div>
        </div>
      )}
    </div>
  );
}

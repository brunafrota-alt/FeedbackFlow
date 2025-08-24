import { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { type Feedback } from '@shared/schema';

interface RatingChartProps {
  feedbacks: Feedback[];
}

export function RatingChart({ feedbacks }: RatingChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const chartData = {
    labels: ['1 Estrela', '2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas'],
    data: [1, 2, 3, 4, 5].map(rating => 
      feedbacks.filter(feedback => feedback.rating === rating).length
    )
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const config: ChartConfiguration = {
      type: chartType,
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Número de Avaliações',
          data: chartData.data,
          backgroundColor: [
            'hsl(0 75% 60%)',     // vermelho para 1 estrela
            'hsl(35 95% 55%)',    // laranja para 2 estrelas  
            'hsl(100 60% 55%)',   // verde claro para 3 estrelas
            'hsl(140 70% 50%)',   // verde médio para 4 estrelas
            'hsl(120 60% 45%)'    // verde escuro para 5 estrelas
          ],
          borderColor: [
            'hsl(0 75% 50%)',     
            'hsl(35 95% 45%)',    
            'hsl(100 60% 45%)',   
            'hsl(140 70% 40%)',   
            'hsl(120 60% 35%)'    
          ],
          borderWidth: chartType === 'bar' ? 2 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType === 'pie'
          }
        },
        scales: chartType === 'bar' ? {
          y: {
            beginAtZero: true,
            grid: {
              color: '#F1F5F9' // slate-100
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        } : {}
      }
    };

    chartInstance.current = new Chart(chartRef.current, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, feedbacks]);

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-6 hover-lift">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Distribuição das Avaliações</h3>
          <p className="text-sm text-muted-foreground">Todas as avaliações</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 hover-lift ${
              chartType === 'bar'
                ? 'bg-primary text-primary-foreground animate-glow'
                : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
            }`}
            onClick={() => setChartType('bar')}
            data-testid="chart-bar-button"
          >
            Barras
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 hover-lift ${
              chartType === 'pie'
                ? 'bg-primary text-primary-foreground animate-glow'
                : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
            }`}
            onClick={() => setChartType('pie')}
            data-testid="chart-pie-button"
          >
            Pizza
          </button>
        </div>
      </div>
      <div className="h-64 animate-slide-in">
        <canvas ref={chartRef} data-testid="ratings-chart" />
      </div>
    </div>
  );
}

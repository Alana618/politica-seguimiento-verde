import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  variant = 'default' 
}: StatsCardProps) => {
  const cardVariants = {
    default: "bg-card border-border",
    primary: "bg-gradient-primary text-white border-transparent",
    secondary: "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20",
    accent: "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20"
  };

  return (
    <Card className={cn(
      "shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105",
      cardVariants[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          variant === 'primary' ? "text-white/90" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === 'primary' ? "bg-white/20" : "bg-muted"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn(
            "text-2xl font-bold",
            variant === 'primary' ? "text-white" : "text-foreground"
          )}>
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "text-green-dark bg-green-dark/10" 
                : "text-destructive bg-destructive/10"
            )}>
              <span className="mr-1">
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        {description && (
          <p className={cn(
            "text-xs mt-1",
            variant === 'primary' ? "text-white/70" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
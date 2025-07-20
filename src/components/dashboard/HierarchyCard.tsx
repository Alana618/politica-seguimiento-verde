import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HierarchyLevel {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

interface HierarchyCardProps {
  title: string;
  levels: HierarchyLevel[];
  className?: string;
}

const HierarchyCard = ({ title, levels, className }: HierarchyCardProps) => {
  return (
    <Card className={cn("shadow-card hover:shadow-hover transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Gestionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {levels.map((level, index) => (
          <div key={level.id} className="group">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className={cn("w-3 h-3 rounded-full", level.color)} />
                <div>
                  <h4 className="font-medium text-sm">{level.name}</h4>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {level.count}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
            {index < levels.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-px h-4 bg-border" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HierarchyCard;
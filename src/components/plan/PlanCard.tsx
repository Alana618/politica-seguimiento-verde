import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  title: string;
  description: string;
  count: number;
  color: string;
  link: string;
}

const PlanCard = ({ title, description, count, color, link }: PlanCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn("w-3 h-3 rounded-full", color)} />
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild className="w-full" size="sm">
          <Link to={link}>
            Gestionar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
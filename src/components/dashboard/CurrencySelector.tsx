
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencies } from "@/utils/currency";

interface CurrencySelectorProps {
  selectedCurrency: { name: string; symbol: string; code: string };
  setSelectedCurrency: (currency: { name: string; symbol: string; code: string }) => void;
}

export default function CurrencySelector({ 
  selectedCurrency, 
  setSelectedCurrency 
}: CurrencySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {selectedCurrency.name}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {currencies.map((currency) => (
          <DropdownMenuItem 
            key={currency.code}
            onClick={() => setSelectedCurrency(currency)}
          >
            {currency.name} ({currency.symbol})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { load } from '@cashfreepayments/cashfree-js';

interface CashfreePaymentProps {
  planName: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
}

export const CashfreePayment = ({ 
  planName, 
  amount, 
  currency, 
  billingCycle, 
  onSuccess, 
  onError,
  children 
}: CashfreePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to proceed with payment.",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating order:', { planName, billingCycle, currency });

      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-cashfree-order',
        {
          body: {
            planName,
            billingCycle,
            currency
          }
        }
      );

      if (orderError) {
        throw new Error(orderError.message || 'Failed to create order');
      }

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      console.log('Order created successfully:', orderData);

      // Handle free plans
      if (orderData.isFree) {
        toast({
          title: "Plan Activated",
          description: `Your ${planName} plan has been activated successfully!`,
        });
        onSuccess?.(orderData.orderId);
        return;
      }

      // Load Cashfree SDK and initialize payment
      const cashfree = await load({ mode: "production" }); // Use "sandbox" for testing

      const checkoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: "_self", // Redirect in the same tab
      };

      console.log('Initiating Cashfree checkout:', checkoutOptions);

      // Redirect to Cashfree payment page
      await cashfree.checkout(checkoutOptions);

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Processing..." : children}
    </Button>
  );
};

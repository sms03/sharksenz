import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollProgressIndicator, ScrollToTopButton } from '@/components/ScrollProgress';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setPaymentStatus('failed');
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('Verifying payment for order:', orderId);

        // Verify payment status
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke(
          'verify-cashfree-payment',
          {
            body: { orderId }
          }
        );

        if (verificationError) {
          throw new Error(verificationError.message);
        }

        console.log('Payment verification result:', verificationData);

        // Get order details
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) {
          throw new Error('Failed to fetch order details');
        }

        setOrderDetails(order);

        // Set status based on verification
        if (verificationData.orderStatus === 'paid') {
          setPaymentStatus('success');
          toast({
            title: "Payment Successful!",
            description: `Your ${order.plan_name} plan has been activated.`,
          });
        } else if (verificationData.orderStatus === 'failed') {
          setPaymentStatus('failed');
        } else {
          setPaymentStatus('pending');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        toast({
          title: "Verification Error",
          description: "Failed to verify payment status. Please contact support.",
          variant: "destructive",
        });
      }
    };

    verifyPayment();
  }, [orderId, toast]);

  const renderStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />;
      default:
        return <div className="h-16 w-16 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />;
    }
  };

  const renderStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your {orderDetails?.plan_name} plan has been activated successfully.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Order ID: {orderId}
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">
              Unfortunately, your payment could not be processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        );
      case 'pending':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-yellow-600 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-4">
              Your payment is being processed. Please wait for confirmation.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive an email once the payment is confirmed.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-600 mb-2">Verifying Payment...</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment status.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Scroll Progress Components - only show if content is scrollable */}
      <ScrollProgressIndicator 
        showOnlyWhenScrolling={false}
        className="z-50"
      />
      <ScrollToTopButton 
        showThreshold={0.2}
        hideOnPages={[]} // Don't hide on this page
      />
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {renderStatusIcon()}
        {renderStatusMessage()}
        
        <div className="flex flex-col space-y-3">
          {paymentStatus === 'success' && (
            <Button 
              onClick={() => navigate('/content')}
              className="w-full"
            >
              Access Content Library <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {paymentStatus === 'failed' && (
            <Button 
              onClick={() => navigate('/pricing')}
              className="w-full"
            >
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
        
        {orderDetails && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Plan: {orderDetails.plan_name}</p>
              <p>Amount: {orderDetails.currency} {orderDetails.amount}</p>
              <p>Billing: {orderDetails.billing_cycle}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

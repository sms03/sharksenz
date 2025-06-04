
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId } = await req.json()
    console.log('Verifying payment for order:', orderId)

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    if (!order.cashfree_order_id) {
      throw new Error('Cashfree order ID not found')
    }

    // Verify payment with Cashfree
    const cashfreeResponse = await fetch(`https://api.cashfree.com/pg/orders/${order.cashfree_order_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': Deno.env.get('CASHFREE_APP_ID') ?? '',
        'x-client-secret': Deno.env.get('CASHFREE_SECRET_KEY') ?? '',
        'x-api-version': '2023-08-01'
      }
    })

    const paymentResult = await cashfreeResponse.json()
    console.log('Cashfree payment verification:', paymentResult)

    if (!cashfreeResponse.ok) {
      throw new Error(`Cashfree API error: ${paymentResult.message || 'Unknown error'}`)
    }

    // Update order status based on payment result
    let orderStatus = 'pending'
    if (paymentResult.order_status === 'PAID') {
      orderStatus = 'paid'
    } else if (paymentResult.order_status === 'FAILED') {
      orderStatus = 'failed'
    } else if (paymentResult.order_status === 'CANCELLED') {
      orderStatus = 'cancelled'
    }

    // Update order
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ 
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateOrderError) {
      console.error('Failed to update order status:', updateOrderError)
    }

    // Update payment record
    const { error: updatePaymentError } = await supabase
      .from('cashfree_payments')
      .update({
        cashfree_payment_id: paymentResult.cf_order_id,
        payment_status: paymentResult.order_status,
        payment_method: paymentResult.payment_method,
        gateway_response: paymentResult,
        updated_at: new Date().toISOString()
      })
      .eq('cashfree_order_id', order.cashfree_order_id)

    if (updatePaymentError) {
      console.error('Failed to update payment record:', updatePaymentError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderStatus: orderStatus,
        paymentStatus: paymentResult.order_status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

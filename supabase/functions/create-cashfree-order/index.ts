
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    const { planName, billingCycle, currency } = await req.json()

    console.log('Creating order for:', { planName, billingCycle, currency, userId: user.id })

    // Define pricing
    const pricing = {
      'Tiger Shark (Free)': { monthly: { usd: 0, eur: 0, gbp: 0, inr: 0 }, yearly: { usd: 0, eur: 0, gbp: 0, inr: 0 } },
      'Great White Shark (Pro)': { monthly: { usd: 29.99, eur: 28.99, gbp: 25.99, inr: 2499 }, yearly: { usd: 299, eur: 275, gbp: 245, inr: 24899 } },
      'Megalodon Shark (Max)': { monthly: { usd: 98.99, eur: 90.99, gbp: 84.99, inr: 7999 }, yearly: { usd: 998, eur: 919, gbp: 875, inr: 84999 } }
    }

    const amount = pricing[planName]?.[billingCycle]?.[currency]
    if (amount === undefined) {
      throw new Error('Invalid plan or pricing')
    }

    // Create order in our database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        plan_name: planName,
        amount: amount,
        currency: currency.toUpperCase(),
        billing_cycle: billingCycle,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      throw new Error('Failed to create order')
    }

    console.log('Order created:', order)

    // For free plans, mark as paid immediately
    if (amount === 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order.id)

      if (updateError) {
        console.error('Failed to update free plan order:', updateError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: order.id,
          isFree: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Create Cashfree order for paid plans
    const cashfreeOrderId = `order_${order.id}_${Date.now()}`
    
    const cashfreeOrderData = {
      order_id: cashfreeOrderId,
      order_amount: amount,
      order_currency: currency.toUpperCase(),
      customer_details: {
        customer_id: user.id,
        customer_email: user.email,
        customer_phone: "9999999999" // You might want to collect this
      },
      order_meta: {
        return_url: `${req.headers.get('origin')}/payment/success?order_id=${order.id}`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-cashfree-payment`
      }
    }

    console.log('Creating Cashfree order:', cashfreeOrderData)

    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': Deno.env.get('CASHFREE_APP_ID') ?? '',
        'x-client-secret': Deno.env.get('CASHFREE_SECRET_KEY') ?? '',
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(cashfreeOrderData)
    })

    const cashfreeResult = await cashfreeResponse.json()
    console.log('Cashfree response:', cashfreeResult)

    if (!cashfreeResponse.ok) {
      throw new Error(`Cashfree API error: ${cashfreeResult.message || 'Unknown error'}`)
    }

    // Update order with Cashfree order ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ cashfree_order_id: cashfreeOrderId })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to update order with Cashfree ID:', updateError)
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('cashfree_payments')
      .insert({
        order_id: order.id,
        cashfree_order_id: cashfreeOrderId,
        payment_status: 'ACTIVE',
        gateway_response: cashfreeResult
      })

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        cashfreeOrderId: cashfreeOrderId,
        paymentSessionId: cashfreeResult.payment_session_id,
        orderToken: cashfreeResult.order_token
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating Cashfree order:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

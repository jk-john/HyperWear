// Quick email test script
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testEmail() {
  console.log('Testing email delivery...')
  
  const testEmail = `test-${Date.now()}@gmail.com`
  console.log('Testing with email:', testEmail)
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'testpassword123',
    options: {
      emailRedirectTo: 'https://www.hyperwear.io/auth/callback?type=signup'
    }
  })
  
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Success! Check database for confirmation_sent_at timestamp')
    console.log('User ID:', data.user?.id)
  }
}

testEmail()
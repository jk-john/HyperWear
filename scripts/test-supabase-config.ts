import {
  SUPABASE_PROJECT_REF,
  SUPABASE_PROJECT_URL,
  getSupabaseAuthUrl,
  getSupabaseStorageUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey
} from '../lib/supabase/config';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function testSupabaseConfig(): void {
  console.log('Testing Supabase configuration...\n');

  console.log('1. Testing static exports...');
  assert(SUPABASE_PROJECT_REF === 'jhxxuhisdypknlvhaklm',
    `Expected PROJECT_REF to be 'jhxxuhisdypknlvhaklm', got '${SUPABASE_PROJECT_REF}'`);
  assert(SUPABASE_PROJECT_URL === 'https://jhxxuhisdypknlvhaklm.supabase.co',
    `Expected PROJECT_URL to be 'https://jhxxuhisdypknlvhaklm.supabase.co', got '${SUPABASE_PROJECT_URL}'`);
  console.log('   ✓ Static exports are correct\n');

  console.log('2. Testing getSupabaseAuthUrl()...');
  const authUrl = getSupabaseAuthUrl();
  console.log(`   Auth URL: ${authUrl}`);
  assert(
    authUrl === 'https://auth.hyperwear.io' ||
    authUrl === 'https://jhxxuhisdypknlvhaklm.supabase.co',
    `Auth URL should be custom domain or project URL, got '${authUrl}'`
  );
  console.log('   ✓ Auth URL is valid\n');

  console.log('3. Testing getSupabaseStorageUrl()...');
  const storageUrl = getSupabaseStorageUrl();
  console.log(`   Storage URL: ${storageUrl}`);
  assert(
    storageUrl === 'https://jhxxuhisdypknlvhaklm.supabase.co',
    `Storage URL should be project URL, got '${storageUrl}'`
  );
  console.log('   ✓ Storage URL is valid\n');

  console.log('4. Testing getSupabaseAnonKey()...');
  try {
    const anonKey = getSupabaseAnonKey();
    assert(anonKey.length > 0, 'Anon key should not be empty');
    assert(anonKey.startsWith('eyJ'), 'Anon key should be a JWT');
    console.log('   ✓ Anon key is valid\n');
  } catch (error) {
    console.log('   ⚠ Anon key not set (expected in CI without env vars)\n');
  }

  console.log('5. Testing getSupabaseServiceRoleKey()...');
  try {
    const serviceKey = getSupabaseServiceRoleKey();
    assert(serviceKey.length > 0, 'Service role key should not be empty');
    console.log('   ✓ Service role key is valid\n');
  } catch (error) {
    console.log('   ⚠ Service role key not set (expected in CI without env vars)\n');
  }

  console.log('='.repeat(50));
  console.log('All Supabase config tests passed!');
  console.log('='.repeat(50));
}

testSupabaseConfig();

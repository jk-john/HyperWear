import { createClient } from "@/types/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const errorData = await request.json();

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert error log
    const { error } = await supabase
      .from('error_logs')
      .insert({
        error_name: errorData.error?.name || 'Unknown Error',
        error_message: errorData.error?.message || 'No message',
        error_stack: errorData.error?.stack,
        context: errorData.context,
        url: errorData.url,
        user_agent: errorData.userAgent,
        metadata: errorData.metadata,
        user_id: user?.id || null,
      });

    if (error) {
      console.error('Failed to log error to database:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in log-error endpoint:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 
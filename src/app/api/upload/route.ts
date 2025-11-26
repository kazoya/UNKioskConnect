import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key, fallback to anon key if not available
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
  }

  // Use service role key for server-side uploads (bypasses RLS)
  // If using anon key, make sure storage policies allow public access
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    const bucket = (formData.get('bucket') as string) || 'events';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { error: 'No path provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      
      // Provide more helpful error messages
      let errorMessage = error.message || 'Failed to upload image';
      
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
        errorMessage = 'Storage bucket "events" not found. Please create it in Supabase Dashboard → Storage → New bucket. Make sure it is set to Public.';
      } else if (error.message?.includes('new row violates row-level security policy') || 
                 error.message?.includes('permission denied') ||
                 error.message?.includes('Permission denied') ||
                 error.statusCode === 403) {
        errorMessage = 'Permission denied. Please create storage policies in Supabase: Go to Storage → events bucket → Policies → Create policies for SELECT and INSERT operations. See FIX_PERMISSION_DENIED.md for details.';
      } else if (error.message?.includes('already exists')) {
        errorMessage = 'File already exists. Please try again.';
      } else if (error.message?.includes('JWT')) {
        errorMessage = 'Authentication error. Please check SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get image URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


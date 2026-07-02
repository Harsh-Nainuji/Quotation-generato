import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/lib/models/Quote';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Generate a short ID for sharing
    const shortId = nanoid(8);
    
    // Strip immutable fields so Mongoose generates a fresh _id
    const { _id, __v, shortId: oldShortId, ...cleanData } = data;
    
    const quote = await Quote.create({
      ...cleanData,
      shortId,
      status: 'shared',
      version: 1
    });
    
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ success: false, error: 'Failed to create quote' }, { status: 500 });
  }
}

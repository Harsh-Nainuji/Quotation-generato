import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/lib/models/Quote';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const quote = await Quote.findOne({ shortId: params.id });
    
    if (!quote) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Prevent immutable field modifications
    const { _id, shortId, __v, ...updateData } = data;
    
    // Increment version if modifying line items/core data
    updateData.version = (updateData.version || 1) + 1;
    
    const quote = await Quote.findOneAndUpdate(
      { shortId: params.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!quote) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ success: false, error: 'Failed to update quote' }, { status: 500 });
  }
}

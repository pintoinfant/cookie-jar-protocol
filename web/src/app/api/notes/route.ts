import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { url, schemaId, jairId } = await request.json();

    const response = await axios.post(url, {
      query: `
        query {
          attestations(where: { schemaId: { equals: "${schemaId}" } }) {
            id
          }
        }
      `
    });

    const notesUID = response?.data?.data?.attestations || [];
    return NextResponse.json(notesUID);
  } catch (error) {
    // console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Error fetching notes' }, { status: 500 });
  }
}

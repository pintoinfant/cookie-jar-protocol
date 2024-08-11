import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { url, schemaId, jairId } = await request.json();

    console.log({url})

    const response = await axios.post(url, {
      query: `
        query {
          attestations(where: { schemaId: { equals: "${schemaId}" } }) {
            schemaId
          }
        }
      `
    });

    const notes = response?.data?.data?.attestations || [];
    console.log({notes})

    return NextResponse.json(response.data);
  } catch (error) {
    // console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Error fetching notes' }, { status: 500 });
  }
}

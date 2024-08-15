import { ImageResponse } from '@vercel/og'
export const runtime = "edge";

export async function GET(request: Request) {
    return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 128,
              background: 'lavender',
            }}
          >
            Hello!
          </div>
        )
      )
}
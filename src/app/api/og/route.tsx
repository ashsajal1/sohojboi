import { ImageResponse } from '@vercel/og'
import { type NextRequest } from 'next/server'

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title");
    const authorName = searchParams.get("authorName");
    const profileImg = searchParams.get("profileImg");
    const date = searchParams.get("date");

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    backgroundColor: 'white',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        fontSize: 45,
                        fontStyle: 'normal',
                        color: 'black',
                        marginTop: 30,
                        marginRight: 30,
                        marginLeft: 30,
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <b>{title}</b>
                </div>

                <div tw="flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                    <img tw="rounded-full" src={profileImg!} width='90' height='90' />
                    <div tw='flex flex-col items-start ml-4'>
                        <p tw='font-bold text-3xl mb-0'>{authorName}</p>
                        <p tw='text-slate-600 text-xl mt-0'>{date}</p>
                    </div>
                </div>
            </div>

        )
    )
}
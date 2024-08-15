import { ImageResponse } from '@vercel/og'
import { type NextRequest } from 'next/server'

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get("title");
    const authorName = searchParams.get("authorName");
    const profileImg = searchParams.get("profileImg");
    const date = searchParams.get("date");

    // console.log(title, profileImg, date);

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
                        fontSize: 25,
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
                    <img tw="rounded-full" src={profileImg!} width='40' height='40' />
                    <div tw='flex flex-col items-center ml-4'>
                        <p tw='font-bold text-xl mb-0'>{authorName}</p>
                        <p tw='text-slate-600 mt-0'>{date}</p>
                    </div>
                </div>
            </div>

        )
    )
}
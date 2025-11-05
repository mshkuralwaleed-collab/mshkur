import { PwaIcon } from '@/lib/icons';
import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <PwaIcon />
    ),
    {
      ...size,
    }
  )
}

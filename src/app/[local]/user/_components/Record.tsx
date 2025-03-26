/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5JKGhArPYDm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AudioRecorderWithVisualizer } from "@/components/ui/Audio"

export default function Record() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full  space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Audio Recorder</CardTitle>
          <CardDescription>Record audio from your device and save it to your computer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-3 items-center space-y-4">
            <div className="relative w-full max-w-[50px]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                <MicIcon className="text-primary" />
              </div>
              <div className="w-full h-0 pb-[100%] rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden" />
            </div>
           <div className="space-y-3">
           <div className="flex items-center space-x-4">
            <AudioRecorderWithVisualizer />
              <Button variant="outline">
                <AlbumIcon className="w-5 h-5" />
                Record
              </Button>
              <Button variant="outline">
                <MonitorStopIcon className="w-5 h-5" />
                Stop
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-4 h-4" />
              <span>00:00</span>
            </div>
           </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AlbumIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <polyline points="11 3 11 11 14 8 17 11 17 3" />
    </svg>
  )
}


function ClockIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MicIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}


function MonitorStopIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="9" y="7" width="6" height="6" rx="1" />
    </svg>
  )
}
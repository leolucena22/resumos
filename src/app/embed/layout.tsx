
import { Viewport } from 'next';

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`body { background: transparent !important; }`}</style>
      <div className="bg-transparent min-h-screen">
        {children}
      </div>
    </>
  )
}

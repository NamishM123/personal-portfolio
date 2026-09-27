import InteractiveWaveShader from '@/components/ui/flowing-waves-shader'

const settings = {
  hasActiveReminders: false,
  hasUpcomingReminders: false,
  disableCenterDimming: false,
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props }
  return (
    <div className="h-screen w-screen relative">
      <InteractiveWaveShader {...s} />
    </div>
  )
}

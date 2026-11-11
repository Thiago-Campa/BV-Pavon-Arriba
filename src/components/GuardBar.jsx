import { useEffect, useRef, useState } from 'react'
import { Phone, Siren } from 'lucide-react'
import { institution } from '../data.js'
import './GuardBar.css'

export default function GuardBar() {
  const [on, setOn] = useState(false)
  const audio = useRef(null)
  const timer = useRef(null)

  const stop = () => {
    clearTimeout(timer.current)
    audio.current?.close?.()
    audio.current = null
    setOn(false)
  }

  const toggle = () => {
    if (on) return stop()
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) {
      const ctx = new AC()
      const osc = ctx.createOscillator()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 850
      lfo.frequency.value = 0.55
      lfoGain.gain.value = 280
      gain.gain.value = 0.035
      lfo.connect(lfoGain).connect(osc.frequency)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      lfo.start()
      audio.current = ctx
    }
    setOn(true)
    timer.current = setTimeout(stop, 7000)
  }

  useEffect(() => stop, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`guard-bar${on ? ' guard-bar--on' : ''}`}>
      <span className="guard-beacon guard-beacon--l" aria-hidden="true" />
      <a href={`tel:${institution.guardPhoneTel}`} className="guard-bar-link">
        <span className="guard-bar-dot" aria-hidden="true" />
        <Phone size={15} />
        <span>
          Guardia: <strong>{institution.guardPhoneDisplay}</strong>
        </span>
      </a>
      <button type="button" className="guard-siren" onClick={toggle} aria-pressed={on}>
        <Siren size={14} />
        {on ? 'Parar sirena' : 'Tocar sirena'}
      </button>
      <span className="guard-beacon guard-beacon--r" aria-hidden="true" />
    </div>
  )
}

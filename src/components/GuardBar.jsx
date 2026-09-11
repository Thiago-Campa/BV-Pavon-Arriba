import { Phone } from 'lucide-react'
import { institution } from '../data.js'
import './GuardBar.css'

export default function GuardBar() {
  return (
    <div className="guard-bar">
      <a href={`tel:${institution.guardPhoneTel}`} className="guard-bar-link">
        <span className="guard-bar-dot" aria-hidden="true" />
        <Phone size={15} />
        <span>
          Guardia: <strong>{institution.guardPhoneDisplay}</strong>
        </span>
      </a>
    </div>
  )
}

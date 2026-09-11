import { institution } from '../data.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        © {new Date().getFullYear()} {institution.name} — {institution.town}
      </div>
    </footer>
  )
}

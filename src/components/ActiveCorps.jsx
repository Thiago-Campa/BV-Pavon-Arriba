import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { activeCorps as fallbackMembers } from '../data.js'
import { api } from '../api.js'
import { RANKS, sortByList } from '../constants.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotify } from '../context/NotifyContext.jsx'
import PersonForm from './PersonForm.jsx'
import './Admin.css'
import './ActiveCorps.css'

const INITIAL_VISIBLE = 2

export default function ActiveCorps() {
  const { isAdmin } = useAuth()
  const { notify, confirm } = useNotify()
  const [members, setMembers] = useState(fallbackMembers)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    api
      .getMembers()
      .then(setMembers)
      .catch(() => {}) // si el servidor no responde, se muestra la lista de data.js
  }, [])

  const sorted = sortByList(members, 'rank', RANKS)
  // El admin ve siempre a todos, para poder administrarlos.
  const showAll = expanded || isAdmin
  const hasMore = !isAdmin && sorted.length > INITIAL_VISIBLE
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE)

  const handleAdd = async ({ firstName, lastName, value }) => {
    const member = await api.addMember({ firstName, lastName, rank: value })
    setMembers((list) => [...list, member])
    setShowForm(false)
    notify(`${member.firstName} ${member.lastName} se agregó al cuerpo activo.`)
  }

  const handleDelete = async (member) => {
    const name = `${member.firstName} ${member.lastName}`
    const ok = await confirm({
      title: 'Eliminar integrante',
      message: `¿Estás seguro de que querés eliminar a ${name} (${member.rank}) del cuerpo activo?`,
      confirmText: 'Sí, eliminar',
    })
    if (!ok) return
    try {
      await api.deleteMember(member.id)
      setMembers((list) => list.filter((m) => m.id !== member.id))
      notify(`${name} se eliminó del cuerpo activo.`)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <section id="cuerpo-activo">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">La institución</span>
          <h2>Cuerpo Activo</h2>
        </motion.div>

        {isAdmin && (
          <>
            {!showForm && (
              <div className="admin-bar">
                <button type="button" className="admin-add-btn" onClick={() => setShowForm(true)}>
                  <Plus size={16} /> Agregar integrante
                </button>
              </div>
            )}
            {showForm && (
              <PersonForm
                title="Agregar al cuerpo activo"
                selectLabel="Cargo"
                options={RANKS}
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            )}
          </>
        )}

        <div className="roster-grid">
          {visible.map((member, i) => (
            <motion.div
              key={member.id}
              className={`roster-card${isAdmin ? ' roster-card--admin' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="roster-icon">
                <Shield size={18} />
              </span>
              <div>
                <p className="roster-name">
                  {member.firstName} {member.lastName}
                </p>
                <p className="roster-rank">{member.rank}</p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="icon-btn icon-btn--danger card-action"
                  onClick={() => handleDelete(member)}
                  aria-label={`Eliminar a ${member.firstName} ${member.lastName}`}
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <button type="button" className="see-more-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { board as fallbackBoard } from '../data.js'
import { api } from '../api.js'
import { ROLES, sortByList } from '../constants.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotify } from '../context/NotifyContext.jsx'
import PersonForm from './PersonForm.jsx'
import './Admin.css'
import './Board.css'

const INITIAL_VISIBLE = 2

export default function Board() {
  const { isAdmin } = useAuth()
  const { notify, confirm } = useNotify()
  const [members, setMembers] = useState(fallbackBoard)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    api
      .getBoard()
      .then(setMembers)
      .catch(() => {}) // si el servidor no responde, se muestra la lista de data.js
  }, [])

  const sorted = sortByList(members, 'role', ROLES)
  // El admin ve siempre a todos, para poder administrarlos.
  const showAll = expanded || isAdmin
  const hasMore = !isAdmin && sorted.length > INITIAL_VISIBLE
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE)

  const handleAdd = async ({ firstName, lastName, value }) => {
    const member = await api.addBoardMember({ firstName, lastName, role: value })
    setMembers((list) => [...list, member])
    setShowForm(false)
    notify(`${member.firstName} ${member.lastName} se agregó a la comisión directiva.`)
  }

  const handleDelete = async (member) => {
    const name = `${member.firstName} ${member.lastName}`
    const ok = await confirm({
      title: 'Eliminar integrante',
      message: `¿Estás seguro de que querés eliminar a ${name} (${member.role}) de la comisión directiva?`,
      confirmText: 'Sí, eliminar',
    })
    if (!ok) return
    try {
      await api.deleteBoardMember(member.id)
      setMembers((list) => list.filter((m) => m.id !== member.id))
      notify(`${name} se eliminó de la comisión directiva.`)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <section id="comision">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">La institución</span>
          <h2>Comisión Directiva</h2>
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
                title="Agregar a la comisión directiva"
                selectLabel="Cargo"
                options={ROLES}
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            )}
          </>
        )}

        <div className="board-grid">
          {visible.map((member, i) => (
            <motion.div
              key={member.id}
              className={`board-card${isAdmin ? ' board-card--admin' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="board-icon">
                <Award size={18} />
              </span>
              <div>
                <p className="board-name">
                  {member.firstName} {member.lastName}
                </p>
                <p className="board-role">{member.role}</p>
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
          <button type="button" className="see-more-btn see-more-btn--gold" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </section>
  )
}

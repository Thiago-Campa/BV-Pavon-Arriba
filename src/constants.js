// Cargos que se pueden elegir al agregar gente. Si querés cambiar el nombre de un cargo,
// hay que cambiarlo acá y también en supabase/paso-2-gestion.sql (restricción "check").
export const RANKS = ['Jefe', 'Sub Jefe', 'Oficial', 'Sub Oficial', 'Bombero']
export const ROLES = ['Presidente', 'Vicepresidente', 'Secretario', 'Tesorero', 'Vocal', 'Órgano de fiscalización']

// Ordena por jerarquía (según el orden de la lista) y, a igual cargo, por orden de carga.
export function sortByList(list, key, order) {
  const pos = (v) => {
    const i = order.indexOf(v)
    return i === -1 ? 99 : i
  }
  return [...list].sort((a, b) => pos(a[key]) - pos(b[key]) || a.id - b.id)
}

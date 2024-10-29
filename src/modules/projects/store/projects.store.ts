import { defineStore } from 'pinia'

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: [] as {
      id: string
      nombre: string
      tareas: { id: string; nombre: string; completada: boolean; fechaCreacion: string }[]
      progreso: number
    }[]
  }),
  actions: {
    agregarProyecto(nombreProyecto: string) {
      const proyecto = {
        id: Date.now().toString(),
        nombre: nombreProyecto,
        tareas: [],
        progreso: 0
      }
      this.proyectos.push(proyecto)
    },
    agregarTarea(idProyecto: string, nombreTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto)
      if (proyecto && proyecto.tareas.length < 10) {
        proyecto.tareas.push({
          id: Date.now().toString(),
          nombre: nombreTarea,
          completada: false,
          fechaCreacion: new Date().toLocaleString()
        })
        this.actualizarProgreso(proyecto.id)
      }
    },
    actualizarProgreso(idProyecto: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto)
      if (proyecto) {
        const totalTareas = proyecto.tareas.length
        const tareasCompletadas = proyecto.tareas.filter((t) => t.completada).length
        proyecto.progreso = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0
      }
    },
    actualizarTarea(idProyecto: string, idTarea: string, nuevoNombre: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto)
      if (proyecto) {
        const tarea = proyecto.tareas.find((tarea) => tarea.id === idTarea)
        if (tarea) {
          tarea.nombre = nuevoNombre
        }
      }
    },
    eliminarTarea(idProyecto: string, idTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto)
      if (proyecto) {
        proyecto.tareas = proyecto.tareas.filter((tarea) => tarea.id !== idTarea)
        this.actualizarProgreso(proyecto.id)
      }
    }
  }
})

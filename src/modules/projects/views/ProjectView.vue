<template>
  <div class="p-8 overflow-x-auto w-full">
    <h2>Nombre Proyecto: {{ proyectoActual?.nombre }}</h2>
    <p>Progreso: {{ proyectoActual?.progreso }}/100</p>
    <!-- Cambiar a 100 -->

    <div class="mt-4">
      <input
        v-model="nuevaTarea"
        type="text"
        placeholder="Agregar nueva tarea"
        class="input input-bordered mr-2"
      />
      <button
        @click="agregarTarea"
        class="btn btn-primary"
        :disabled="proyectoActual?.tareas.length >= 10"
      >
        Agregar
      </button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Completada</th>
          <th>Tarea</th>
          <th>Fecha y hora de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarea, index) in proyectoActual?.tareas" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <input type="checkbox" v-model="tarea.completada" @change="actualizarProgreso()" />
          </td>
          <td>
            <span v-if="!tarea.editando">{{ tarea.nombre }}</span>
            <input v-else v-model="tarea.nombre" />
          </td>
          <td>{{ tarea.fechaCreacion }}</td>
          <td>
            <button
              @click="eliminarTarea(proyectoActual?.id, tarea.id)"
              class="btn btn-danger mr-2"
            >
              Eliminar
            </button>
            <button v-if="!tarea.editando" @click="editarTarea(tarea)" class="btn btn-primary">
              Editar
            </button>
            <button
              v-else
              @click="guardarTarea(proyectoActual?.id, tarea.id, tarea.nombre)"
              class="btn btn-success"
            >
              Guardar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore } from '../store/projects.store'

const proyectosStore = useProyectosStore()
const route = useRoute()
const nuevaTarea = ref('')

const proyectoActual = computed(() =>
  proyectosStore.proyectos.find((proyecto) => proyecto.id === route.params.id)
)

// Agregar tarea
const agregarTarea = () => {
  if (nuevaTarea.value.trim() !== '' && proyectoActual.value?.tareas.length < 10) {
    proyectosStore.agregarTarea(route.params.id as string, nuevaTarea.value.trim())
    nuevaTarea.value = ''
  }
}

// Actualizar el progreso del proyecto
const actualizarProgreso = () => {
  const tareasCompletadas = proyectoActual.value?.tareas.filter((t) => t.completada).length || 0
  // Actualiza el progreso en base a las tareas completadas
  if (proyectoActual.value) {
    proyectoActual.value.progreso = Math.min(tareasCompletadas * 10, 100) // Aumenta el progreso en 10 por tarea completada y no supera 100
  }
}

// Editar tarea
const editarTarea = (tarea: { id: string; nombre: string; editando?: boolean }) => {
  tarea.editando = true
}

// Guardar tarea
const guardarTarea = (idProyecto: string | undefined, idTarea: string, nuevoNombre: string) => {
  if (idProyecto && nuevoNombre.trim() !== '') {
    proyectosStore.actualizarTarea(idProyecto, idTarea, nuevoNombre)
    const tarea = proyectoActual.value?.tareas.find((t) => t.id === idTarea)
    if (tarea) {
      tarea.editando = false // Cambia el modo de edición
    }
  }
}

// Eliminar tarea
const eliminarTarea = (idProyecto: string | undefined, idTarea: string) => {
  if (idProyecto) {
    proyectosStore.eliminarTarea(idProyecto, idTarea)
    actualizarProgreso() // Recalcular el progreso después de eliminar una tarea
  }
}
</script>

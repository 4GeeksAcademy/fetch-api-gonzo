import React, { useState, useEffect } from 'react';

// URL de la API y usuario por defecto
const apiUrl = 'https://playground.4geeks.com/todo';
const defaultUser = 'spain-72';

export const Api = () => {
  // Estado para almacenar las tareas del usuario
  const [userTodos, setUserTodos] = useState([]);
  // Estado para almacenar la nueva tarea
  const [nuevaTarea, setnuevaTarea] = useState('');
  // Estado para almacenar la tarea que se está editando
  const [editarTarea, seteditarTarea] = useState(null);
  // Estado para almacenar la etiqueta de la tarea editada
  const [editedTaskLabel, setEditedTaskLabel] = useState('');

  // useEffect para obtener las tareas del usuario cuando se carga el componente
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // Hacer una solicitud GET a la API para obtener las tareas del usuario
        const response = await fetch(`${apiUrl}/users/${defaultUser}`);
        // Lanzar un error si la respuesta no es correcta
        if (!response.ok) throw new Error('Error al importar');
        // Parsear la respuesta a JSON
        const data = await response.json();
        console.log('Fetched todos:', data);
        // Establecer las tareas obtenidas en el estado
        setUserTodos(data.todos || []);
      } catch (error) {
        // Mostrar un mensaje de error en la consola si ocurre algún problema
        console.error('Error al importar:', error);
      }
    };

    fetchTodos();
  }, []);

  // Función para eliminar una tarea
  const deleteTask = async (id) => {
    try {
      // Hacer una solicitud DELETE a la API para eliminar la tarea
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE'
      });
      // Lanzar un error si la respuesta no es correcta
      if (!response.ok) throw new Error('Error al eliminar');
      // Filtrar la tarea eliminada del estado
      setUserTodos(userTodos.filter(todo => todo.id !== id));
    } catch (error) {
      // Mostrar un mensaje de error en la consola si ocurre algún problema
      console.error('Error al eliminar:', error);
    }
  };

  // Función para actualizar el estado de una tarea (completada/sin completar)
  const toggleTask = async (id) => {
    // Encontrar la tarea que se quiere actualizar
    const task = userTodos.find(todo => todo.id === id);
    // Crear un objeto con la tarea actualizada
    const actualizarTarea = { ...task, is_done: !task.is_done };

    try {
      // Hacer una solicitud PUT a la API para actualizar la tarea
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizarTarea),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Lanzar un error si la respuesta no es correcta
      if (!response.ok) throw new Error('Error al actualizar');
      // Parsear la respuesta a JSON
      const data = await response.json();
      // Actualizar el estado con la tarea modificada
      setUserTodos(userTodos.map(todo => (todo.id === id ? data : todo)));
    } catch (error) {
      // Mostrar un mensaje de error en la consola si ocurre algún problema
      console.error('Error al actualizar:', error);
    }
  };

  // Función para modificar el nombre de una tarea
  const editTask = async (id) => {
    // No hacer nada si el campo de la etiqueta está vacío
    if (!editedTaskLabel.trim()) return;

    // Encontrar la tarea que se quiere modificar
    const task = userTodos.find(todo => todo.id === id);
    // Crear un objeto con la tarea actualizada
    const actualizarTarea = { ...task, label: editedTaskLabel };

    try {
      // Hacer una solicitud PUT a la API para actualizar la tarea
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizarTarea),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Lanzar un error si la respuesta no es correcta
      if (!response.ok) throw new Error('Error al modificar tarea');
      // Parsear la respuesta a JSON
      const data = await response.json();
      // Actualizar el estado con la tarea modificada
      setUserTodos(userTodos.map(todo => (todo.id === id ? data : todo)));
      // Restablecer el estado de edición
      seteditarTarea(null);
      setEditedTaskLabel('');
    } catch (error) {
      // Mostrar un mensaje de error en la consola si ocurre algún problema
      console.error('Error al modificar tarea:', error);
    }
  };

  // Función para agregar una nueva tarea
  const addTask = async () => {
    // No hacer nada si el campo de la nueva tarea está vacío
    if (!nuevaTarea.trim()) return;

    // Crear un objeto para la nueva tarea
    const nuevaTareaObj = { label: nuevaTarea, is_done: false };

    try {
      // Hacer una solicitud POST a la API para agregar la nueva tarea
      const response = await fetch(`${apiUrl}/todos/${defaultUser}`, {
        method: 'POST',
        body: JSON.stringify(nuevaTareaObj),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Lanzar un error si la respuesta no es correcta
      if (!response.ok) throw new Error('Error al añadir tarea');
      // Parsear la respuesta a JSON
      const data = await response.json();
      // Actualizar el estado con la nueva tarea añadida
      setUserTodos([...userTodos, data]);
      // Limpiar el campo de la nueva tarea
      setnuevaTarea('');
    } catch (error) {
      // Mostrar un mensaje de error en la consola si ocurre algún problema
      console.error('Error al añadir tarea:', error);
    }
  };

  // Renderizar el componente
  return (
    <div className="container mt-5">
      <h1>TODO List para Api por Gonzo {defaultUser}</h1>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Añadir nueva tarea..."
          value={nuevaTarea}
          onChange={(e) => setnuevaTarea(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTask}>Añadir</button>
      </div>
      
      <ul className="list-group">
        {userTodos.map((todo) => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editarTarea === todo.id ? (
              <input
                type="text"
                value={editedTaskLabel}
                onChange={(e) => setEditedTaskLabel(e.target.value)}
                className="form-control me-2"
              />
            ) : (
              <span>{todo.label}</span>
            )}
            <div>
              {editarTarea === todo.id ? (
                <button className="btn btn-success me-2" onClick={() => editTask(todo.id)}>Guardar</button>
              ) : (
                <>
                  <button className="btn btn-secondary me-2" onClick={() => { seteditarTarea(todo.id); setEditedTaskLabel(todo.label); }}>Editar</button>
                  <button className="btn btn-warning me-2" onClick={() => toggleTask(todo.id)}>
                    {todo.is_done ? 'Completada' : 'Sin completar'}
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteTask(todo.id)}>Borrar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

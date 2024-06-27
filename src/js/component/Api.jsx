import React, { useState, useEffect } from 'react';

const apiUrl = 'https://playground.4geeks.com/todo';
const defaultUser = 'spain-72';

export const Api = () => {
  const [userTodos, setUserTodos] = useState([]);
  const [nuevaTarea, setnuevaTarea] = useState('');
  const [editarTarea, seteditarTarea] = useState(null);
  const [editedTaskLabel, setEditedTaskLabel] = useState('');

  // Obtener las tareas del usuario al cargar el componente
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${defaultUser}`);
        if (!response.ok) throw new Error('Error al importar');
        const data = await response.json();
        console.log('Fetched todos:', data); // Debugging
        setUserTodos(data.todos || []);
      } catch (error) {
        console.error('Error al importar:', error);
      }
    };

    fetchTodos();
  }, []);

  // Eliminar tarea
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar');
      setUserTodos(userTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Actualizar estado de tarea (completada/sin completar)
  const toggleTask = async (id) => {
    const task = userTodos.find(todo => todo.id === id);
    const actualizarTarea = { ...task, is_done: !task.is_done };

    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizarTarea),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al actualizar');
      const data = await response.json();
      setUserTodos(userTodos.map(todo => (todo.id === id ? data : todo)));
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Modificar nombre de tarea
  const editTask = async (id) => {
    if (!editedTaskLabel.trim()) return;

    const task = userTodos.find(todo => todo.id === id);
    const actualizarTarea = { ...task, label: editedTaskLabel };

    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizarTarea),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al modificar tarea');
      const data = await response.json();
      setUserTodos(userTodos.map(todo => (todo.id === id ? data : todo)));
      seteditarTarea(null);
      setEditedTaskLabel('');
    } catch (error) {
      console.error('Error al modificar tarea:', error);
    }
  };

  // Agregar tarea
  const addTask = async () => {
    if (!nuevaTarea.trim()) return;

    const nuevaTareaObj = { label: nuevaTarea, is_done: false };

    try {
      const response = await fetch(`${apiUrl}/todos/${defaultUser}`, {
        method: 'POST',
        body: JSON.stringify(nuevaTareaObj),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al añadir tarea');
      const data = await response.json();
      setUserTodos([...userTodos, data]);
      setnuevaTarea('');
    } catch (error) {
      console.error('Error al añadir tarea:', error);
    }
  };

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
                <button className="btn btn-secondary me-2" onClick={() => { seteditarTarea(todo.id); setEditedTaskLabel(todo.label); }}>Editar</button>
              )}
              <button className="btn btn-warning me-2" onClick={() => toggleTask(todo.id)}>
                {todo.is_done ? 'Completada' : 'Sin completar'}
              </button>
              <button className="btn btn-danger" onClick={() => deleteTask(todo.id)}>Borrar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

